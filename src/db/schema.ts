import { integer, pgTable, varchar } from "drizzle-orm/pg-core";
import type { title } from "process";
import { relations } from 'drizzle-orm';

export const usersTable = pgTable("users", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  name: varchar({ length: 255 }).notNull(),
  email: varchar({ length: 255 }).notNull().unique(),
});
export const postsTable = pgTable("posts", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  id_user: integer().notNull().references(() => usersTable.id),
  title: varchar({ length: 255 }).notNull(),
  comment: varchar({ length: 255 }).notNull().unique(),
});

export const Users = usersTable.$inferSelect;
