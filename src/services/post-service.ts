import { db } from "../db"
import { eq } from "drizzle-orm";
import { postsTable } from "../db/posts";
import { usersTable } from "../db/users";

export const getPosts = async () => {
    return await db.select().from(postsTable)
}

export const getPostById = async (PostID: string) => {
  return await db.select().from(postsTable).where(eq(postsTable.id, PostID))
}

export const getPostsWithUser = async () => {
    return await db
      .select({
        post: {
          id: postsTable.id,
          title: postsTable.title,
          content: postsTable.content,
        },
        user: {
          name: usersTable.name,
        }
      })
      .from(postsTable)
      .leftJoin(usersTable, eq(postsTable.id_user, usersTable.id));
  };
  