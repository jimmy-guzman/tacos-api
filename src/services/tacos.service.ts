import { eq } from "drizzle-orm";
import { db } from "@/db/client";
import { tacosTable } from "@/db/schemas/tacos";
import type { NewTacoBody, UpdateTacoBody } from "@/schemas/tacos.entities";

export const tacosService = {
  async create(data: NewTacoBody) {
    const [created] = await db.insert(tacosTable).values(data).returning();

    return created;
  },

  async delete(id: string) {
    const [deleted] = await db
      .delete(tacosTable)
      .where(eq(tacosTable.id, id))
      .returning();

    return deleted;
  },
  async findAll() {
    return await db.select().from(tacosTable);
  },

  async findById(id: string) {
    const [taco] = await db
      .select()
      .from(tacosTable)
      .where(eq(tacosTable.id, id))
      .limit(1);

    return taco;
  },

  async update(id: string, data: UpdateTacoBody) {
    const [updated] = await db
      .update(tacosTable)
      .set(data)
      .where(eq(tacosTable.id, id))
      .returning();

    return updated;
  },
};
