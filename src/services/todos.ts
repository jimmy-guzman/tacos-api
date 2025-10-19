import { eq } from "drizzle-orm";

import db from "@/db/client";
import { todosTable } from "@/db/schemas/todos";
import type { NewTodoBody, UpdateTodoBody } from "@/schemas/entities";

export const todosService = {
  async findAll(filters?: { completed?: boolean }) {
    const query = db.select().from(todosTable);

    if (filters?.completed !== undefined) {
      query.where(eq(todosTable.completed, filters.completed));
    }

    return query.orderBy(todosTable.createdAt);
  },

  async findById(id: string) {
    const [row] = await db
      .select()
      .from(todosTable)
      .where(eq(todosTable.id, id));

    return row ?? null;
  },

  async create(data: NewTodoBody) {
    const [created] = await db.insert(todosTable).values(data).returning();
    return created;
  },

  async update(id: string, data: UpdateTodoBody) {
    const [updated] = await db
      .update(todosTable)
      .set(data)
      .where(eq(todosTable.id, id))
      .returning();

    return updated ?? null;
  },

  async delete(id: string) {
    const [deleted] = await db
      .delete(todosTable)
      .where(eq(todosTable.id, id))
      .returning();

    return deleted ?? null;
  },
};
