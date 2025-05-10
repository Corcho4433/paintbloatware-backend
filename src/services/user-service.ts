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
    const user = await db.query.usersTable.findFirst({
        where: (users, {eq}) => eq(users.email, email)
    });
    if(!user){
        throw new Error("No hay usuario con el email/nombre dado :3")
    }
    return user
}

export const createUser = async (email:string, name:string, password_hash:string) => {
    await db.insert(usersTable).values({password:password_hash, name, email});
    return await getUserByEmail(email)
}