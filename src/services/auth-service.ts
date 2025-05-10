import { db } from "../db"
import { eq } from "drizzle-orm";
import { getUserByEmail } from "./user-service";
import { usersTable } from "../db/users";
import { sessionsTable } from "../db/sessions";

export const verifyUser = async (email: string, password: string) => {
    const user = await getUserByEmail(email)
    const is_match = await Bun.password.verify(password, user.password)
    if(!is_match){
      throw new Error("La contraseña no coincide aprende a escribir :v")
    }
    return user
}

const generateSessionToken = (length = 16) =>{
  const charset = "QWERTYUIOPASDFGHJKLZXCVBNM1234567890qwertyuiopasdfghjklxcvbnm"
  let result = ""
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random()*charset.length)
    result += charset[randomIndex]
  }
  return result
}

export const generateUserSession = async (userId: string) => {
  const session_token = generateSessionToken(32)
  await db.insert(sessionsTable).values({id_user: userId, session_token: session_token})
  return session_token
}

export const createPassword = async (password: string) => {
  const password_hash = await Bun.password.hash(password);
  return password_hash
}