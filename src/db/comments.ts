import { uuid, pgTable, text } from "drizzle-orm/pg-core";
import { postsTable } from "./posts";
import { usersTable } from "./users";

export const commentsTable = pgTable("comments", {
  id: uuid().primaryKey().defaultRandom(),
  id_user: uuid().notNull().references(() => usersTable.id),
  id_post: uuid().notNull().references(() => postsTable.id),
  content: text().notNull(),
});