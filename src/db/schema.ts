import { integer, pgTable, varchar } from "drizzle-orm/pg-core";

export const usersTable = pgTable("users", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  name: varchar({ length: 255 }).notNull(),
  email: varchar({ length: 255 }).notNull().unique(),
});
export const postsTable = pgTable("posts", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  id_user: integer().notNull().references(() => usersTable.id),
  title: varchar({ length: 255 }).notNull(),
  comment: varchar({ length: 255 }).notNull(),
});

export const Users = usersTable.$inferSelect;
