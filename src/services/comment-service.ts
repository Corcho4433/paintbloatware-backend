import { db } from "../db"
import { eq } from "drizzle-orm";
import { postsTable, commentsTable } from "../db/schema"

export const getComments = async () => {
    return await db.select().from(commentsTable)
}

export const getCommentById = async (CommentID: number) => {
  return await db.select().from(commentsTable).where(eq(commentsTable.id, CommentID));
}

export const getCommentsByPost = async (CommentID: number) => {
  return await db.select().from(commentsTable).where(eq(commentsTable.id_post, CommentID));
}

export const getCommentsByUser = async (UserID: number) => {
  return await db.select().from(commentsTable).where(eq(commentsTable.id_user, UserID));
}

export const getAllInfoPosts = async () => {
    return await db 
      .select({
        comment: {
          id: commentsTable.id,
          id_user: commentsTable.id_user,
          content: commentsTable.content,
        },
        post: {
          id: postsTable.id,
          title: postsTable.title,
          content: postsTable.content,
        }
      })
      .from(commentsTable)
      .leftJoin(postsTable, eq(postsTable.id, commentsTable.id_post));
  }; 