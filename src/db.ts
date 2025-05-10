
import "dotenv/config";
import { drizzle } from "drizzle-orm/node-postgres";

import * as users from './db/users'
import * as posts from './db/posts'
import * as comments from './db/comments'

const DATABASE_URL=`postgresql://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}`

export const db = drizzle({
  connection: {
    connectionString: DATABASE_URL
  },
  schema: {
    ...users,
    ...posts,
    ...comments
  }
});



