import express from 'express';
import { getPostById, getPosts,getPostsWithUser } from '../services/post-service';
import { db } from '../db';
import { eq, and } from "drizzle-orm";
import { usersTable } from '../db/users';
import { randomBytes } from 'crypto';
import { error } from 'console';
import { createUser, getUserByEmail } from '../services/user-service';
import { createPassword, generateUserSession, verifyUser } from '../services/auth-service';

export const authRouter = express.Router();

authRouter.post('/register', async (req, res) => {
    try {
        const { body } = req
        const { name, email, password } = body
        const password_hash = await createPassword(password)
        const user = await createUser(email, name, password_hash)
        if(!user) throw new Error("No se creo el usuario :3")
        res.status(201).json({ data: user.id})
    } catch (error) {   
        res.status(500).json({ error: (error as Error).message });
    }
});

authRouter.post('/login', async (req, res) => {
    try {
        const { body } = req
        const { email, password } = body
        const user = await verifyUser(email, password)
        const session_token = generateUserSession(user.id)
        res.status(200).json({ data: session_token })
    } catch (error) {
        res.status(500).json({ error: (error as Error).message });
    }
});