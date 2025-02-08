import { Hono } from "hono";
import authmiddleware from "../middleware";
import { PrismaClient } from "@prisma/client/edge";
import { withAccelerate } from "@prisma/extension-accelerate";
import { z } from "zod";
import dayjs from "dayjs";
export const blogRouter = new Hono<{
    Bindings: {
        DATABASE_URL: string

    },
    Variables: {
        userId: Number;
    }
}>()

blogRouter.use('*', authmiddleware)

blogRouter.get('/protected', (c) => {
    return c.json({
        message: 'This is a protected route',
        userId: c.get("userId")

    })
})
blogRouter.post('total', async (c) => {
    const prisma = new PrismaClient({
        datasourceUrl: c.env.DATABASE_URL
    }).$extends(withAccelerate())
    const body = await c.req.json();
    const whereFilter: { genre?: string, authorId?: number, title : {contains : string}} = {title : {contains : ""}};
    if (body.genre !== "all") {
        whereFilter.genre = body.genre
    }
    if(body.search && body.search.trim()){
        whereFilter.title.contains = body.search
    }
    if (body.authorId) {
        whereFilter.authorId = Number(body.authorId)
    }
    const total = await prisma.blog.count({
        where: whereFilter
    })
    return c.json({ total })
})
blogRouter.post('/sort/time/:id', async (c) => {
    const prisma = new PrismaClient({
        datasourceUrl: c.env.DATABASE_URL
    }).$extends(withAccelerate())
    const id = (c.req.param("id"))
    const body = await c.req.json();
    const whereFilter: { genre?: string, authorId?: number, title : {contains : string} } = {title : {contains : ""}};
    if (body.genre && body.genre !== "all") {
        whereFilter.genre = body.genre
    }
    if(body.search && body.search.trim()){
        whereFilter.title.contains = body.search
    }
    if (body.authorId) {
        whereFilter.authorId = Number(body.authorId)
    }
    if (id === "asc") {
        const blogs = await prisma.blog.findMany({
            where: whereFilter,
            orderBy: {
                createdAt: "asc"
            },
            skip: body.skip,
            take: 10,
            select: {
                id: true,
                title: true,
                views: true,
                authorId: true,
                author: {
                    select: {
                        name: true
                    }
                },
                createdAt: true,
                genre: true,
                _count: {
                    select: {
                        votes: true
                    }
                }
            }
        })
        const filter_blogs = blogs.map((blog) => {
            return { ...blog, votes: blog._count.votes }
        })
        return c.json(filter_blogs);
    }
    const blogs = await prisma.blog.findMany({
        where: whereFilter,
        orderBy: {
            createdAt: "desc"
        },
        skip: body.skip,
        take: 10,
        select: {
            id: true,
            title: true,
            views: true,
            authorId: true,
            author: {
                select: {
                    name: true
                }
            },
            createdAt: true,
            genre: true,
            _count: {
                select: {
                    votes: true
                }
            }
        }
    })
    const filter_blogs = blogs.map((blog) => {
        return { ...blog, votes: blog._count.votes }
    })
    return c.json(filter_blogs);
})
blogRouter.post('/sort/views', async (c) => {
    const prisma = new PrismaClient({
        datasourceUrl: c.env.DATABASE_URL
    }).$extends(withAccelerate())
    const body = await c.req.json();
    const whereFilter: { genre?: string, authorId?: number, title : {contains : string} } = {title : {contains : ""}};
    if (body.genre && body.genre !== "all") {
        whereFilter.genre = body.genre
    }
    if(body.search && body.search.trim()){
        whereFilter.title.contains = body.search
    }
    if (body.authorId) {
        whereFilter.authorId = Number(body.authorId)
    }
    const blogs = await prisma.blog.findMany({
        where: whereFilter,
        orderBy: [{
            views: "desc",
        },
        {
            votes: {
                _count: "desc"
            }
        },
        {
            createdAt: "desc"
        }
        ],
        skip: body.skip,
        take: 10,
        select: {
            id: true,
            title: true,
            views: true,
            authorId: true,
            author: {
                select: {
                    name: true
                }
            },
            _count: {
                select: {
                    votes: true
                }
            },
            createdAt: true,
            genre: true
        }
    })
    const filter_blogs = blogs.map((blog) => {
        return { ...blog, votes: blog._count.votes }
    })
    return c.json(filter_blogs);
})
blogRouter.get('/sort/trending', async (c) => {
    const prisma = new PrismaClient({
        datasourceUrl: c.env.DATABASE_URL
    }).$extends(withAccelerate())
    const blogs = await prisma.blog.findMany({
        select: {
            id: true,
            title: true,
            views: true,
            createdAt: true,
            authorId: true,
            _count: {
                select: {
                    votes: true,
                },
            },
        },
        orderBy: [
            {
                views: 'desc',
            },
            {
                votes: {
                    _count: 'desc',
                },
            },
        ],
        take: 10,
    });

    // Step 2: Further refine the list based on a trending score
    const weight = 2; // Weight for likes
    const trendingBlogs = blogs.map(blog => {
        const likes = blog._count.votes || 0;
        const views = blog.views || 0;
        const ageInDays = dayjs().diff(dayjs(blog.createdAt), 'days') || 1;
        const score = (views + likes * weight) / ageInDays;

        return {
            ...blog,
            score,
        };
    });

    // Step 3: Sort blogs by the score and get the top 10
    const top10TrendingBlogs = trendingBlogs
        .sort((a, b) => b.score - a.score)
        .slice(0, 10);

    return c.json(top10TrendingBlogs);
})

blogRouter.get('/blog/:id', async (c) => {
    const prisma = new PrismaClient({
        datasourceUrl: c.env.DATABASE_URL
    }).$extends(withAccelerate())
    const blog = await prisma.blog.findUnique({
        where: {
            id: parseInt(c.req.param("id"))
        },
        select: {
            id: true,
            title: true,
            content: true,
            views: true,
            authorId: true,
            genre: true,
            author: {
                select: {
                    name: true
                }
            },
            createdAt: true,
            comments: {
                orderBy: {
                    createdAt: "desc"
                },
                select: {
                    id: true,
                    author: {
                        select: {
                            name: true
                        }
                    },
                    comment: true,
                    authorId: true,
                    createdAt: true,
                }
            },
            _count: {
                select: {
                    votes: true
                }
            }
        }
    })
    if (!blog) {
        c.status(404)
        return c.json({
            message: "Blog not found"
        })
    }
    return c.json({ blog })
})
blogRouter.delete('/delete/:id', async (c) => {
    try {
        const prisma = new PrismaClient({
            datasourceUrl: c.env.DATABASE_URL
        }).$extends(withAccelerate())
        const blogId = parseInt(c.req.param("id"))
        const votes = await prisma.vote.deleteMany({
            where: {
                blogId: blogId
            }
        })
        const comments = await prisma.comment.deleteMany({
            where: {
                BlogId: blogId
            }
        })
        const blog = await prisma.blog.delete({
            where: {
                id: blogId
            }
        })
        return c.json({ message: "Blog deleted Succesfully" })
    }
    catch (e) {
        c.status(500);
        console.log(e);
        return c.text("error occcurred")
    }
})
const blogBody = z.object({
    title: z.string(),
    content: z.string(),
    genre: z.string(),
})

blogRouter.post('/', async (c) => {
    const body = await c.req.json();
    const { success } = blogBody.safeParse(body)
    if (!success) {
        c.status(401);
        return c.json({
            message: "Enter valid title and content"
        })
    }
    const prisma = new PrismaClient({
        datasourceUrl: c.env.DATABASE_URL
    }).$extends(withAccelerate())
    try {
        const blog = await prisma.blog.create({
            data: { ...body, authorId: c.get("userId") }
        })
        return c.json({ blog })
    }
    catch (e) {
        c.status(500);
        console.log(e);
        return c.text("error occcurred")
    }
})
blogRouter.put('/update/:id', async (c) => {
    try {
        const body = await c.req.json();
        const bodyId = parseInt(c.req.param("id"))
        const safeBody = blogBody.safeParse(body)
        const prisma = new PrismaClient({
            datasourceUrl: c.env.DATABASE_URL
        }).$extends(withAccelerate())
        const blog = await prisma.blog.update({
            where: {
                id: bodyId
            },
            data: {
                ...safeBody.data
            }
        })
        return c.json({ blog })
    }
    catch (e) {
        c.status(500);
        console.log(e);
        return c.text("error occcurred")
    }
})
blogRouter.post('/vote/check', async (c) => {
    try {
        const body = await c.req.json();
        const prisma = new PrismaClient({
            datasourceUrl: c.env.DATABASE_URL
        }).$extends(withAccelerate())
        const userId = Number(c.get("userId"))
        const blog = await prisma.vote.findFirst({
            where: {
                userId: userId,
                blogId: body.id
            }
        })
        if (blog) {
            return c.json({ vote: true });
        }
        return c.json({ vote: false });
    }
    catch (e) {
        c.status(500);
        console.log(e);
        return c.text("error occcurred")
    }
})

blogRouter.post('/vote', async (c) => {
    try {
        const body = await c.req.json();
        const prisma = new PrismaClient({
            datasourceUrl: c.env.DATABASE_URL
        }).$extends(withAccelerate())
        const userId = Number(c.get("userId"))
        const blog = await prisma.vote.findFirst({
            where: {
                userId: userId,
                blogId: body.id
            }
        })
        if (blog) {
            const downVote = await prisma.vote.deleteMany({
                where: {
                    userId: userId,
                    blogId: body.id
                }
            })
            return c.json({ vote: false })
        }
        const upVote = await prisma.vote.create({
            data: {
                userId: userId,
                blogId: body.id
            }
        })
        return c.json({ vote: true })
    }
    catch (e) {
        c.status(500);
        console.log(e);
        return c.text("error occcurred")
    }
})

blogRouter.put('/view', async (c) => {
    try {
        const body = await c.req.json();
        const prisma = new PrismaClient({
            datasourceUrl: c.env.DATABASE_URL
        }).$extends(withAccelerate())
        const blog = await prisma.blog.update({
            where: {
                id: Number(body.id)
            },
            data: {
                views: {
                    increment: 1
                }
            }
        })
        return c.json({ blog })
    }
    catch (e) {
        c.status(500);
        console.log(e);
        return c.text("error occcurred")
    }
})

blogRouter.post('/comment', async (c) => {
    try {
        const body = await c.req.json();
        const prisma = new PrismaClient({
            datasourceUrl: c.env.DATABASE_URL
        }).$extends(withAccelerate())
        const userId = Number(c.get("userId"))
        console.log(body)
        const comment = await prisma.comment.create({
            data: {
                ...body,
                authorId: userId
            }
        })
        return c.json({ comment })
    }
    catch (e) {
        c.status(500);
        console.log(e);
        return c.text("error occcurred")
    }
})

blogRouter.get('/comment/:id', async (c) => {
    try {
        const prisma = new PrismaClient({
            datasourceUrl: c.env.DATABASE_URL
        }).$extends(withAccelerate())
        const id = c.req.param("id");
        const comments = await prisma.comment.findMany({
            where: {
                BlogId: Number(id)
            },
            orderBy: {
                createdAt: "desc"
            },
            select: {
                id: true,
                comment: true,
                authorId: true,
                createdAt: true,
                author: {
                    select: {
                        name: true
                    }
                }
            }
        })
        return c.json({ comments })
    }
    catch (e) {
        c.status(500);
        console.log(e);
        return c.text("error occcurred")
    }
})

blogRouter.delete('/comment/:id', async (c) => {
    try {
        const prisma = new PrismaClient({
            datasourceUrl: c.env.DATABASE_URL
        }).$extends(withAccelerate())
        const comment = await prisma.comment.delete({
            where: {
                id: Number(c.req.param("id"))
            }
        })
        return c.json({ message: "Comment deleted" })
    }
    catch (e) {
        c.status(500);
        console.log(e);
        return c.text("error occcurred")
    }
})
