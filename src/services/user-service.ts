import { db } from "../db"
import { eq } from "drizzle-orm";
import { Users, usersTable } from "../db/schema"

export const getUsers = async () => {
    return await db.select().from(usersTable)
}

export const getUserById = async (UserID: number) => {
    return await db.select().from(usersTable).where(eq(usersTable.id, UserID))
}