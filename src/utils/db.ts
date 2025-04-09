import { seed, reset } from "drizzle-seed";
import *  as schema from "../db/schema"
import { db } from "../db"

async function makeSeed() {
    await seed(db, schema )
}

async function resetDatabase() {
    await reset(db, schema)
}

const command = process.argv[2]

if (command === "makeSeed") {
  makeSeed()
} else if (command === "resetDatabase")
    {
    resetDatabase()
}