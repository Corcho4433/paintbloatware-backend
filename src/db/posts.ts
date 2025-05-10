import { integer, pgTable, text, customType, uuid } from "drizzle-orm/pg-core";
import { usersTable } from "./users";
import { relations } from "drizzle-orm";
import { commentsTable } from "./comments";

/* export const bytea = customType<{ data: string; notNull: false; default: false }>({
  dataType() {
    return "bytea";
  },
  toDriver(val) {
    let newVal = val;
    if (val.startsWith("0x")) {
      newVal = val.slice(2);
    }

    return Buffer.from(newVal, "hex");
  },
  fromDriver(val: unknown) {
    return (val as Buffer).toString("hex");
  },
}) */

export const postsTable = pgTable("posts", {
  id: uuid().primaryKey().defaultRandom(),
  id_user: uuid().notNull().references(() => usersTable.id),
  title: text().notNull(),
  //image_data: bytea("data").notNull(),
  content: text().notNull(),
});

export const postsTableRelations = relations(postsTable, ({ one, many }) => ({
  user: one(usersTable, {
    fields: [postsTable.id_user],
    references: [usersTable.id]
  }),
  comments: many(commentsTable)
}))
