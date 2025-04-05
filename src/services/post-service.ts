import { db } from "../db"
import { eq } from "drizzle-orm";
import { postsTable, usersTable } from "../db/schema"

export const getPosts = async () => {
    return await db.select().from(postsTable)
}

export const getPostsWUser = async () => {
    return await db
      .select({
        post: {
          id: postsTable.id,
          title: postsTable.title,
          comment: postsTable.comment,
        },
        user: {
          name: usersTable.name,
        }
      })
      .from(postsTable)
      .leftJoin(usersTable, eq(postsTable.id_user, usersTable.id));
  };