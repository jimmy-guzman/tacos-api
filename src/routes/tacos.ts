import { hono } from "@/lib/hono";
import {
  CreateTacoRoute,
  DeleteTacoRoute,
  GetTacoRoute,
  ListTacosRoute,
  UpdateTacoRoute,
} from "@/schemas/tacos.openapi";
import { tacosService } from "@/services/tacos.service";

const app = hono();

app.openapi(ListTacosRoute, async (c) => {
  const tacos = await tacosService.findAll();

  return c.json(tacos, 200);
});

app.openapi(CreateTacoRoute, async (c) => {
  const body = c.req.valid("json");

  const created = await tacosService.create(body);

  return c.json(created, 201);
});

app.openapi(GetTacoRoute, async (c) => {
  const { tacoId } = c.req.valid("param");

  const taco = await tacosService.findById(tacoId);

  return taco
    ? c.json(taco, 200)
    : c.json(
        {
          message: `Taco ${tacoId} not found`,
          status: 404,
        },
        404,
      );
});

app.openapi(UpdateTacoRoute, async (c) => {
  const { tacoId } = c.req.valid("param");
  const patch = c.req.valid("json");

  const updated = await tacosService.update(tacoId, patch);

  if (!updated) {
    return c.json(
      {
        message: `Taco ${tacoId} not found`,
        status: 404,
      },
      404,
    );
  }

  return c.json(updated, 200);
});

app.openapi(DeleteTacoRoute, async (c) => {
  const { tacoId } = c.req.valid("param");

  const deleted = await tacosService.delete(tacoId);

  return deleted
    ? c.body(null, 204)
    : c.json(
        {
          message: `Taco ${tacoId} not found`,
          status: 404,
        },
        404,
      );
});

export default app;
