import { db } from "../db"
import { usersTable } from "../db/users"

export const getUsers = async () => {
    return await db.select().from(usersTable)
}

export const getUserById = async (UserID: string) => {
    return await db.query.usersTable.findFirst({
        where: (users, {eq}) => eq(users.id, UserID)
    });
}

export const getUserByEmail = async (email:string) => {
    return await db.query.usersTable.findFirst({
        where: (users, {eq}) => eq(users.email, email)
    });
}

export const createUserByEmailAndName = async (email:string, name:string) => {
    return await db.query.usersTable.findFirst({
        where: (users, {eq, and}) => and(eq(users.email, email), eq(users.name, name))
    });
}