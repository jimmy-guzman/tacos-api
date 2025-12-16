import { z } from "@hono/zod-openapi";
import {
  createInsertSchema,
  createSelectSchema,
  createUpdateSchema,
} from "drizzle-zod";
import { tacosTable } from "@/db/schemas/tacos";

export const Taco = createSelectSchema(tacosTable, {
  id: (s) => s.openapi({ example: "taco_01h2xcejqtf2nbrexx3vqjhp41" }),
  name: (s) => s.openapi({ example: "Al Pastor Perfection" }),
  filling: (s) => s.openapi({ example: "nopales" }),
  toppings: (s) => s.openapi({ example: ["cilantro", "onion", "lime"] }),
  notes: (s) => s.openapi({ example: "Extra crispy, light on the salt" }),
}).openapi("Taco");

export const NewTacoBody = createInsertSchema(tacosTable, {
  name: (s) => s.min(1).openapi({ example: "Al Pastor Perfection" }),
  filling: (s) => s.min(1).openapi({ example: "nopales" }),
  toppings: (s) => s.openapi({ example: ["cilantro", "onion", "lime"] }),
  notes: (s) => s.openapi({ example: "Extra crispy, light on the salt" }),
})
  .pick({
    name: true,
    filling: true,
    toppings: true,
    notes: true,
  })
  .openapi("NewTacoBody");

export type NewTacoBody = z.infer<typeof NewTacoBody>;

export const UpdateTacoBody = createUpdateSchema(tacosTable, {
  name: (s) => s.min(1).openapi({ example: "Al Pastor Perfection" }),
  filling: (s) => s.min(1).openapi({ example: "carnitas" }),
  toppings: (s) => s.openapi({ example: ["cilantro", "onion"] }),
  notes: (s) => s.openapi({ example: "Updated notes" }),
})
  .pick({
    name: true,
    filling: true,
    toppings: true,
    notes: true,
  })
  .partial()
  .openapi("UpdateTacoBody");

export type UpdateTacoBody = z.infer<typeof UpdateTacoBody>;

export const ApiError = z
  .object({
    message: z
      .string()
      .openapi({ example: "Your request did not match the expected schema." }),
    status: z.number().int().min(100).max(599).openapi({ example: 422 }),
  })
  .openapi("ApiError");
