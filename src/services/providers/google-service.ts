import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt';
import { db } from '../../db/db';
import { access } from 'fs';
import type { Account, User } from '@prisma/client';
import { createOAuthUser } from '../user-service';
import { generateRandomUsername } from '../../utils/randomName';
import { ValidationError } from '../../errors/server_errors';
import { resourceUsage } from 'process';

passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID!,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
  callbackURL: "http://localhost:3000/api/auth/google/callback"
}, async (accessToken, verifyRefreshToken, profile, done) => {

  try {
    const email = profile.emails?.[0]?.value
    if (!email) {
      throw new ValidationError("Google User has no email")
    }
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