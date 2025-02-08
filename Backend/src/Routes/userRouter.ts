import { Hono } from "hono";
import { z } from "zod";
import {  sign } from 'hono/jwt'
import bcrypt from 'bcryptjs';
import { PrismaClient } from '@prisma/client/edge'
import { withAccelerate } from "@prisma/extension-accelerate";
import { followRouter } from "./followRouter";
import { followingRouter } from "./followingRouter";
import authmiddleware from "../middleware";
type Bindings = {
    DATABASE_URL: string
    JWT_SECRET: string
}
export const userRouter = new Hono<{ Bindings: Bindings,Variables:{userId:Number}}>()

const signupBody = z.object({
    email: z.string().email(),
    name: z.string(),
    password: z.string()
})
userRouter.get('/getuser/:id',async (c)=>{
    const prisma = new PrismaClient({
        datasourceUrl: c.env.DATABASE_URL
    }).$extends(withAccelerate())
    const userId = Number(c.req.param("id"));
    if (isNaN(userId)) {
        return c.json({ message: "Invalid userId" }, 400);
    }
    try {
        const user = await prisma.user.findUnique({
            where: {
                id: userId
            }
        });
        if (!user) {
            return c.json({ message: "User not found" }, 404);
        }
        return c.json(user);
    } catch (e) {
        console.log(e);
        return c.json({
            message: "Error occurred while trying to get the user"
        }, 500);
    }
})
userRouter.post('/signup', async (c) => {
    const body = await c.req.json();
    const { success } = signupBody.safeParse(body)
    if (!success) {
        c.status(400);
        return c.json({
            message: "Enter valid email"
        })
    }
    const prisma = new PrismaClient({
        datasourceUrl: c.env.DATABASE_URL
      }).$extends(withAccelerate())

    try {
        const userExists = await prisma.user.findFirst({
            where: {
                email: body.email,

            }
        })

        if (userExists) {
            c.status(409);
            return c.json({
                message: "User already exists"
            });
        }
    } catch (e) {
        console.log(e);
        return c.text("Error")
    }

    try {
        const salt = bcrypt.genSaltSync(10);
        const hash = bcrypt.hashSync(body.password, salt);
        const user = await prisma.user.create({
            data: {
                email: body.email,
                name: body.name,
                password: hash
            }


        })
        const payload = {
            email: user.email,
            id: user.id,
            exp: Math.floor(Date.now() / 1000) + 60 * 60 * 60,
        }
        // Add this before the sign function to verify
        const jwtToken = await sign(payload, c.env.JWT_SECRET);
        return c.text(jwtToken);
    }
    catch (e) {
        c.status(500);
        console.log(e);
        return c.text("error occcurred")
    }
})

userRouter.get('/view/:id',authmiddleware,async(c)=>{
    const prisma = new PrismaClient({
        datasourceUrl: c.env.DATABASE_URL
    }).$extends(withAccelerate())

    const idparam= c.req.param('id');
    const id=parseInt(idparam);
    try{
        const response= await prisma.user.findFirst({
            where:{
                id:id
            },
            select:{
                name:true,
                followers:true,
                following:true,
                blogs:true
                
            }
        })
        if(response){
            c.status(200);
            return c.json({response});
        }else
        {
            c.status(404);
            return c.json({
                message:"User Does not exists"
            })
        }
    }catch(e){
        return c.text("Error in profile view")
    }
    
})
userRouter.get('/getid',authmiddleware,async(c)=>{
    try{
        const userId = Number(c.get("userId"))
        c.status(200);
        return c.json({userId:userId})
    }
    catch(e){
        c.status(400)
        return c.json({userId:17})
    }
})
userRouter.get('/profile',authmiddleware,async(c)=>{
    const prisma = new PrismaClient({
        datasourceUrl: c.env.DATABASE_URL
    }).$extends(withAccelerate());

    const userId = Number(c.req.query("id"))
    try{
        const response=await prisma.user.findFirst({
            where:{
                id:userId
            },
            select:{
                id:true,
                name:true,
                followers:true,
                following:true,
                blogs:true,
                email:true
            }
        })
        if(response){
            c.status(200);
            return c.json({response})
        }else
        {
            c.status(400);
            return c.text("Error occurred in profile")
        }
    }catch(e){
        console.log(e);
        return c.text("Error occurred in profile")
    }

})
const signinBody = z.object({
    email: z.string().email(),
    password: z.string()
})
userRouter.post('/signin', async (c) => {
    const body = await c.req.json();
    const { success } = signinBody.safeParse(body)
    if (!success) {
        c.status(401);
        return c.json({
            message: "Enter valid email"
        })
    }
    const prisma = new PrismaClient({
        datasourceUrl: c.env.DATABASE_URL,
    }).$extends(withAccelerate())

    try {
        const userExists = await prisma.user.findFirst({
            where: {
                email: body.email,
            }
        })

        if (userExists && bcrypt.compareSync(body.password, userExists.password)) {
        

            const payload = {
                email: userExists.email,
                id: userExists.id,
                exp: Math.floor(Date.now() / 1000) + 60 * 60 * 60,
            }
            const jwtToken = await sign(payload, c.env.JWT_SECRET);

            c.status(200);
            return c.text(jwtToken);
        }
        else {
            return c.text("invalid credentials")
        }
    } catch (e) {
        console.log(e);
        c.status(500)
        return c.text("Error")
    }
})
userRouter.post('/follow/check', authmiddleware, async (c) => {
    const prisma = new PrismaClient({
        datasourceUrl: c.env.DATABASE_URL
    }).$extends(withAccelerate());
    const userIdParam=c.get("userId")
    const  {targetUserIdParam} = await c.req.json();
    const userId = Number(userIdParam);
    const targetUserId = Number(targetUserIdParam);
    if (isNaN(userId) || isNaN(targetUserId)) {
        return c.json({ message: "Invalid userId or targetUserId" }, 400);
    }
    if (userId === targetUserId) {
        return c.json({ message: "You cannot follow yourself" }, 400);
    }
    try {
        const existingFollow = await prisma.follows.findFirst({
            where: {
                followerId: targetUserId,
                followingId: userId
            }
        });
        if (existingFollow) {
            return c.json({ follow : true });
        }
        return c.json({ follow : false });
    } catch (e) {
        console.log(e);
        return c.json({
            message: "Error occurred while trying to check if you are following the user"
        }, 500);
    }
})
userRouter.post('/follow', authmiddleware, async (c) => {
    const prisma = new PrismaClient({
        datasourceUrl: c.env.DATABASE_URL
    }).$extends(withAccelerate());

    const userIdParam=c.get("userId")
    const  {targetUserIdParam}  = await c.req.json(); 
    const userId = Number(userIdParam);
    const targetUserId = Number(targetUserIdParam);
    
    

    if (isNaN(userId) || isNaN(targetUserId)) {
        return c.json({ message: "Invalid userId or targetUserId" }, 400);
    }

    if (userId === targetUserId) {
        return c.json({ message: "You cannot follow yourself" }, 400);
    }

    try {
        const existingFollow = await prisma.follows.findFirst({
            where: {
                followerId:targetUserId,
                followingId:userId
            }
        });

        if (existingFollow) {
            return c.json({ message: "You are already following this user" }, 400);
        }

        // Create the follow relationship
        const follow = await prisma.follows.create({
            data: {
                followerId: targetUserId,
                followingId: userId
            }
        });

        return c.json({ message: "Successfully followed the user", follow: follow });
    } catch (e) {
        console.log(e);
        return c.json({
            message: "Error occurred while trying to follow the user"
        }, 500);
    }
});

userRouter.post('/unfollow', authmiddleware, async (c) => {
    const prisma = new PrismaClient({
        datasourceUrl: c.env.DATABASE_URL
    }).$extends(withAccelerate());

    const userIdParam=c.get("userId")
    const  {targetUserIdParam } = await c.req.json(); 
    const userId = Number(userIdParam);
    const targetUserId = Number(targetUserIdParam);
    

    if (isNaN(userId) || isNaN(targetUserId)) {
        return c.json({ message: "Invalid userId or targetUserId" }, 400);
    }

    if (userId === targetUserId) {
        return c.json({ message: "You cannot unfollow yourself" }, 400);
    }

    try {
        // Check if the follow relationship exists
        const existingFollow = await prisma.follows.findFirst({
            where: {
                followerId: targetUserId,
                followingId: userId
            }
        });

        if (!existingFollow) {
            return c.json({ message: "You are not following this user" }, 400);
        }

        // Delete the follow relationship
        await prisma.follows.delete({
            where: {
                followerId_followingId: {
                    followerId: existingFollow.followerId,
                    followingId: existingFollow.followingId
                }
            }
        });

        return c.json({ message: "Successfully unfollowed the user" });
    } catch (e) {
        console.log(e);
        return c.json({
            message: "Error occurred while trying to unfollow the user"
        }, 500);
    }
});

userRouter.route('/followers', followRouter)
userRouter.route('/following',followingRouter)