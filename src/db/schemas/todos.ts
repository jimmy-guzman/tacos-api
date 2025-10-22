import { createId } from "@paralleldrive/cuid2";
import { relations } from "drizzle-orm";
import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

import { user } from "./auth-schema";

export const todosTable = sqliteTable("todos", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => createId()),
  title: text("title").notNull(),
  completed: integer("is_completed", { mode: "boolean" })
    .notNull()
    .default(false),
  createdBy: text("created_by")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  updatedBy: text("updated_by").references(() => user.id, {
    onDelete: "set null",
  }),
  createdAt: integer("created_at", { mode: "timestamp" })
    .notNull()
    .$defaultFn(() => new Date()),
  updatedAt: integer("updated_at", { mode: "timestamp" })
    .notNull()
    .$defaultFn(() => new Date())
    .$onUpdate(() => new Date()),
});

export const todosRelations = relations(todosTable, ({ one }) => ({
  creator: one(user, {
    fields: [todosTable.createdBy],
    references: [user.id],
    relationName: "createdTodos",
  }),
  updater: one(user, {
    fields: [todosTable.updatedBy],
    references: [user.id],
    relationName: "updatedTodos",
  }),
}));
