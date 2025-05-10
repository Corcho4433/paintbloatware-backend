import { relations } from "drizzle-orm";
import { uuid, pgTable, text} from "drizzle-orm/pg-core";
import { postsTable } from "./posts";
import { sessionsTable } from "./sessions";

export const usersTable = pgTable("users", {
  id: uuid().primaryKey().defaultRandom(),
  name: text().notNull(),
  email: text().notNull().unique(),
  password: text().notNull()
});

export const usersTableRelations = relations(usersTable, ({ many }) => ({
  posts: many(postsTable),
  session: many(sessionsTable)
}))

export type User = typeof usersTable.$inferSelect;