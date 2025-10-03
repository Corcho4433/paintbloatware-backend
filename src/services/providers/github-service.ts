import passport from 'passport';

import { Strategy as GitHubStrategy, type Profile } from 'passport-github2';
import { db } from '../../db/db';
import type { Account, User } from '@prisma/client';
import { createOAuthUser } from '../user-service';
import { generateRandomUsername } from '../../utils/randomName';
import { ValidationError } from '../../errors/server_errors';

passport.use(new GitHubStrategy({
  clientID: process.env.GITHUB_CLIENT_ID!,
  clientSecret: process.env.GITHUB_CLIENT_SECRET!,
  callbackURL: "http://localhost:3000/api/auth/github/callback"
}, async (accessToken : string, refreshToken: string, profile: Profile, done: (error: any, user?: any) => void) => {

  try {
    let email = profile.emails?.[0]?.value
    if (!email) {
      // Fetch emails directamente desde la API de GitHub
      const res = await fetch("https://api.github.com/user/emails", {
        headers: { Authorization: `token ${accessToken}` }
      });
      const emails = await res.json() as Array<{ email: string; primary: boolean; verified: boolean }>;
      email = emails.find((e: any) => e.primary && e.verified)?.email;
    }

    if (!email) throw new Error("No verified email found");
    
    const user = await createOrReturnUser(email);
    if (!user) {
      throw new ValidationError("User is undefined");
    }
    const account = await createOrReturnAccount(profile.provider, profile.id, user.id);
    if (!account) {
      throw new ValidationError("Account is undefined")
    }
    return done(null, user);
  } catch (err) {
    return done(err, undefined);
  }
}));

const createOrReturnAccount = async (
  provider: string,
  providerAccountID: string,
  userId: string
): Promise<Account | null> => {
  try {
    const existingAccount = await db.account.findUnique({
      where: {
        provider_providerAccountId: {
          provider: provider,
          providerAccountId: providerAccountID,
        },
      },
    });

    if (existingAccount) return existingAccount;

    // No account found → create a new one
    return await db.account.create({
      data: {
        provider,
        providerAccountId: providerAccountID,
        userId,
        type: "oauth",
      },
    });
  } catch (error) {
    console.error(error);
    return null;
  }
};



const createOrReturnUser = async (email: string): Promise<User | null> => {
  try {
    const existingUser = await db.user.findUnique({
      where: { email }
    });

    if (existingUser) return existingUser;

    // No user found → create a new one
    return await createOAuthUser(email, generateRandomUsername());
  } catch (error) {
    console.error(error);
    return null;
  }
};