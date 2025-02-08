import { Hono } from "hono";
import authmiddleware from "../middleware";
import { PrismaClient } from '@prisma/client/edge'
import { withAccelerate } from "@prisma/extension-accelerate";
type Bindings = {
    DATABASE_URL: string
    JWT_SECRET: string
}
export const followingRouter = new Hono<{ Bindings: Bindings, 
    Variables: {
    userId: Number;
    }}>();

    followingRouter.get('/',authmiddleware, async (c) => {
        const prisma = new PrismaClient({
            datasourceUrl: c.env.DATABASE_URL
        }).$extends(withAccelerate())
        const userIdParam = c.get("userId");
            
        const userId = Number(userIdParam);
    
        if (isNaN(userId)) {
        return c.json({ message: "Invalid userId" }, 400);
        }
        try {
            const following = await prisma.follows.findMany({
                where: {
                    followingId: userId
                },
                select: {
                    followerId: true,
                    following : {
                        select : {
                            name : true
                        }
                    }
                }
            });
            const filter_following = following.map((follow)=>{
                return {
                    name : follow.following.name,
                    id : follow.followerId
                }
            })
            return c.json(filter_following);
        } catch (e) {
            console.log(e);
            c.status(500);
            return c.json({
                message: "error occurred"
            })
        }
    })