import { Hono } from "hono";
import { PrismaClient } from '@prisma/client/edge'
import { withAccelerate } from "@prisma/extension-accelerate";
import authmiddleware from "../middleware";
type Bindings = {
    DATABASE_URL: string
    JWT_SECRET: string
}
export const followRouter = new Hono<{
    Bindings: Bindings,
    Variables: {
        userId: Number;
    }
}>();
followRouter.get('/', authmiddleware, async (c) => {
    const prisma = new PrismaClient({
        datasourceUrl: c.env.DATABASE_URL
    }).$extends(withAccelerate())
    const userIdParam = c.get("userId");

    const userId = Number(userIdParam);

    if (isNaN(userId)) {
        return c.json({ message: "Invalid userId" }, 400);
    }
    try {
        const followers = await prisma.follows.findMany({
            where: {
                followerId: userId
            },
            select: {
                followingId: true, 
                followers : {
                    select : {
                        name : true
                    }
                }              
            }
        });
        const filter_followers = followers.map((follower)=>{
            return {
                name : follower.followers.name,
                id : follower.followingId
            }
        })        
        return c.json(filter_followers);
    } catch (e) {
        console.log(e);
        return c.json({
            message: "error occurred"
        })
    }
})
// followRouter.get('/:followerId', async (c) => {
//     const prisma = new PrismaClient({
//         datasourceUrl: c.env.DATABASE_URL
//     }).$extends(withAccelerate())

//     const followerid = c.req.query("followerId");
//     const followerIdnum = Number(followerid)
//     if (isNaN(followerIdnum)) {
//         return c.json({ message: "Invalid userId" }, 400);
//     }
//     try {
//         const follower = await prisma.follows.findMany({
//             where: {
//                 followerId: userId
//             },
//             select: {
//                 followingId: true,
//             }
//         });
//         if (followers.length === 0) {
//             return c.json({ message: "No followers found" }, 404);
//         }

//         return c.json({ followers: followers });
//     } catch (e) {
//         console.log(e);
//         return c.json({
//             message: "error occurred"
//         })
//     }
// })