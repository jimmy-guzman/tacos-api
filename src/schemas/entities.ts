import { z } from "@hono/zod-openapi";
import {
  createInsertSchema,
  createSelectSchema,
  createUpdateSchema,
} from "drizzle-zod";

import { todosTable } from "@/db/schemas/todos";

export const Todo = createSelectSchema(todosTable, {
  id: (s) => s.openapi({ example: "550e8400-e29b-41d4-a716-446655440000" }),
  title: (s) => s.openapi({ example: "Clean dishes" }),
  completed: (s) => s.openapi({ example: false }),
}).openapi("Todo");

export const NewTodoBody = createInsertSchema(todosTable, {
  title: (s) => s.min(1).openapi({ example: "Clean dishes" }),
})
  .pick({ title: true })
  .openapi("NewTodoBody");

export type NewTodoBody = z.infer<typeof NewTodoBody>;

export const UpdateTodoBody = createUpdateSchema(todosTable, {
  title: (s) => s.min(1).openapi({ example: "Clean dishes" }),
  completed: (s) => s.openapi({ example: true }),
})
  .pick({ title: true, completed: true })
  .openapi("UpdateTodoBody");

export type UpdateTodoBody = z.infer<typeof UpdateTodoBody>;

export const ApiError = z
  .object({
    message: z
      .string()
      .openapi({ example: "Your request did not match the expected schema." }),
    status: z.int().min(100).max(599).openapi({ example: 422 }),
  })
  .openapi("ApiError");
