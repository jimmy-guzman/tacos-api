import { hono } from "@/lib/hono";
import {
  CreateTodoRoute,
  DeleteTodoRoute,
  GetTodoRoute,
  ListTodosRoute,
  UpdateTodoRoute,
} from "@/schemas/routes";
import { todosService } from "@/services/todos";

const app = hono();

app.openapi(ListTodosRoute, async (c) => {
  const { completed } = c.req.valid("query");

  const rows = await todosService.findAll({ completed });

  return c.json(rows, 200);
});

app.openapi(CreateTodoRoute, async (c) => {
  const user = c.get("user");

  if (!user) {
    return c.json(
      {
        status: 401,
        message: "Unauthorized",
      },
      401,
    );
  }

  const body = c.req.valid("json");

  const created = await todosService.create(body, user.id);

  return c.json(created, 201);
});

app.openapi(GetTodoRoute, async (c) => {
  const { todoId } = c.req.valid("param");

  const row = await todosService.findById(todoId);

  return row
    ? c.json(row, 200)
    : c.json(
        {
          status: 404,
          message: `Todo ${todoId} not found`,
        },
        404,
      );
});

app.openapi(UpdateTodoRoute, async (c) => {
  const user = c.get("user");

  if (!user) {
    return c.json(
      {
        status: 401,
        message: "Unauthorized",
      },
      401,
    );
  }

  const { todoId } = c.req.valid("param");
  const patch = c.req.valid("json");

  const updated = await todosService.update(todoId, patch, user.id);

  if (!updated) {
    return c.json(
      {
        status: 404,
        message: `Todo ${todoId} not found`,
      },
      404,
    );
  }

  return c.json(updated, 200);
});

app.openapi(DeleteTodoRoute, async (c) => {
  const { todoId } = c.req.valid("param");

  const deleted = await todosService.delete(todoId);

  return deleted
    ? c.body(null, 204)
    : c.json(
        {
          status: 404,
          message: `Todo ${todoId} not found`,
        },
        404,
      );
});

export default app;
