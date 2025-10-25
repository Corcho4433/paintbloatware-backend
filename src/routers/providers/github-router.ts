import { Router } from "express";
import passport from "passport";
import { generateUserSession } from "../../services/auth-service";
import type { User } from "@prisma/client";

// Define the frontend path, adjust the URL as needed for your frontend
const frontendPath = process.env.FRONTEND_PATH || "http://localhost:5173";

export const githubRouter = Router();


githubRouter.get('/github',
  passport.authenticate('github', {scope: ['user:email']})
);

githubRouter.get('/github/callback', 
  passport.authenticate('github', {session: false}),
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
      .redirect(`${frontendPath}/oauth/success?id=${user.id}&pfp=${encodeURIComponent(user.urlPfp || '')}`);
  }
)