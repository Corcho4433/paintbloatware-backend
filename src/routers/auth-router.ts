import express from 'express';
import { getPostById, getPosts,getPostsWithUser } from '../services/post-service';
import { db } from '../db';
import { usersTable } from '../db/schema';

export const postRouter = express.Router();

postRouter.post('/register', async (req, res) => {
    try {
        const { body } = req
        const { name, email } = body
        await db.insert(usersTable).values({name, email});
    } catch (error) {
        res.status(500).json({ error: 'Internal server error skibidi' });
    }
});

postRouter.post('/login', async (req, res) => {
try {
    const posts = await getPosts();
    res.json({ "posts": posts });
} catch (error) {
    res.status(500).json({ error: 'Internal server error skibidi' });
}
});