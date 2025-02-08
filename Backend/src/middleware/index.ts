import { Hono, Next } from 'hono'
import { jwt,verify } from 'hono/jwt'
import type { JwtVariables } from 'hono/jwt'
import { string } from 'zod'

type Binding={
    DATABASE_URL: string;
    JWT_SECRET:string
}
const app = new Hono<{ Bindings: Binding,Variables: {
    userId: Number;
} }>()

const authmiddleware = async (c:any,next:Next)=>{
    const authHeader=c.req.header("authorization")
    if(!authHeader){
        c.status(403);
        return c.json({
            message:"no token found"
        })
    }
    try{
        const secret2= c.env.JWT_SECRET;
        const token = authHeader.replace('Bearer ', '')
        const verifyUser= await verify(authHeader,secret2);
        if(verifyUser){
            c.set("userId",verifyUser.id);
            await next();
        }
        else
        {
            c.status(403);
            return c.text("Token Expired. Kindly login again")
        }
    }
    catch(e){
        console.log(e)
        c.status(403)
        return c.text("Token Expired. Kindly login again.")
    }
}

export default authmiddleware;