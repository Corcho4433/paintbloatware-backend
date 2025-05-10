import { relations } from "drizzle-orm";
import { uuid, pgTable, text, index } from "drizzle-orm/pg-core";
import { postsTable } from "./posts";
import { usersTable } from "./users";

export const sessionsTable = pgTable("sessions", {
  id: uuid().primaryKey().defaultRandom(),
  id_user: uuid().notNull().references(() => usersTable.id),
  session_token: text().notNull().unique()
},
(table) => [
  index('user_session_unique').on(table.id_user, table.session_token)
]);

export const sessionsTableRelations = relations(sessionsTable, ({ one }) => ({
  user: one(usersTable, {
    fields: [sessionsTable.id_user],
    references: [usersTable.id]
  }),
}))

export type Session = typeof sessionsTable.$inferSelect;