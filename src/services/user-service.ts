import { db } from "../db"
import { Users, usersTable } from "../db/schema"

export const getUsers = async () => {
    return await db.select().from(usersTable)
}