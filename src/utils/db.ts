import { seed, reset } from "drizzle-seed";
import * as users from '../db/users'
import * as comments from '../db/comments'
import * as posts from '../db/posts'

import { db } from "../db"

async function makeSeed() {
    await seed(db, { ...users, ...posts, ...comments })
}

async function resetDatabase() {
    await reset(db, { ...users, ...posts, ...comments })
}

const command = process.argv[2]

if (command === "makeSeed") {
  makeSeed()
} else if (command === "resetDatabase")
    {
    resetDatabase()
}