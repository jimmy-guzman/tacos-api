import { sql } from "drizzle-orm";
import { sqliteTable } from "drizzle-orm/sqlite-core";
import { typeid } from "typeid-js";

export const tacosTable = sqliteTable("tacos", (t) => ({
  id: t
    .text()
    .primaryKey()
    .$defaultFn(() => typeid("taco").toString()),
  name: t.text().notNull(),
  filling: t.text().notNull(),
  toppings: t.text({ mode: "json" }).$type<string[]>().notNull(),
  notes: t.text(),
  createdAt: t
    .integer({ mode: "timestamp" })
    .notNull()
    .default(sql`(unixepoch())`),
}));
