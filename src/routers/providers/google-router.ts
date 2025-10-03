import { Router } from "express";
import passport from "passport";
import jwt from 'jsonwebtoken';
import { generateUserSession } from "../../services/auth-service";
import type { User } from "@prisma/client";

// Define the frontend path, adjust the URL as needed for your frontend
const frontendPath = process.env.FRONTEND_PATH || "http://localhost:5173";

export const googleRouter = Router();


googleRouter.get('/google',
  passport.authenticate('google', {scope: ['email']})
);

googleRouter.get('/google/callback', 
  passport.authenticate('google', {session: false}),
  async (req, res) => {
    const user = req.user as User;
    const {session_token, refresh_token} = await generateUserSession(user.id);
    res
			.cookie("session_token", session_token, {
				httpOnly: true,
				secure: true,
				sameSite: "strict",
				maxAge: 1000 * 60 * 60, // 1 hora
			})
			.cookie("refresh_token", refresh_token, {
				httpOnly: true,
				secure: true,
				sameSite: "strict",
				maxAge: 1000 * 60 * 60 * 24 * 7, // 7 días
			})
			.status(200)
      .redirect(`http://localhost:5173/oauth/success?id=${user.id}&pfp=${encodeURIComponent(user.urlPfp || '')}`);
  }
)