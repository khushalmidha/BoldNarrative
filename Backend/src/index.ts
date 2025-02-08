import { Hono } from 'hono'
import { PrismaClient } from '@prisma/client/edge'
import { withAccelerate } from '@prisma/extension-accelerate'
import { cors } from 'hono/cors'
import { userRouter } from './Routes/userRouter'
import { blogRouter } from './Routes/blogRouter'
const app = new Hono<{
	Bindings: {
		DATABASE_URL: string
	}
}>()



app.use('/*',cors());
app.route('/api/user',userRouter);
app.route('/api/blog',blogRouter);

export default app
