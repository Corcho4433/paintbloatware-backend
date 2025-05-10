import express from 'express';
import { getPostById, getPosts,getPostsWithUser } from '../services/post-service';
import { db } from '../db';
import { eq, and } from "drizzle-orm";
import { usersTable } from '../db/users';
import { randomBytes } from 'crypto';
import { error } from 'console';
import { createUserByEmailAndName, getUserByEmail } from '../services/user-service';

export const authRouter = express.Router();

authRouter.post('/register', async (req, res) => {
    try {
        const { body } = req
        const { name, email, password } = body
        const password_hash = await Bun.password.hash(password);
        await db.insert(usersTable).values({password : password_hash, name, email});
        const user = await getUserByEmail(email)
        if(!user) throw new Error("No se creo el usuario :3")
        res.status(201).json({ data: user.id})
    } catch (error) {   
        res.status(500).json({ error: (error as Error).message });
    }
});

authRouter.post('/login', async (req, res) => {
    try {
        const { body } = req
        const { name, email } = body
        const user = await getUserByEmail(email)
        if(!user) throw new Error("No hay usuario con el email/nombre dado :3")
        res.status(200).json({ data: user.id })
    } catch (error) {
        res.status(500).json({ error: (error as Error).message });
    }
});