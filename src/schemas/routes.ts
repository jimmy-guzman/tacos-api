import { createRoute, z } from "@hono/zod-openapi";

import { NewTodoBody, ApiError, Todo, UpdateTodoBody } from "./entities";

const TodoIdParam = z
  .object({
    todoId: z.cuid2().min(1).openapi({ example: "ckw8z5f5g0000qz6g5f5g0000" }),
  })
  .openapi("TodoIdParam");

const ListTodosQuery = z
  .object({
    completed: z
      .string()
      .transform((val) => val === "true")
      .optional(),
  })
  .openapi("ListTodosQuery");

export const ListTodosRoute = createRoute({
  method: "get",
  path: "/todos",
  tags: ["Todos"],
  summary: "List Todos",
  description:
    "Retrieve a list of todos, optionally filtered by completion status.",
  request: {
    query: ListTodosQuery,
  },
  responses: {
    200: {
      summary: "OK",
      description: "List of todos",
      content: { "application/json": { schema: z.array(Todo) } },
    },
    422: {
      summary: "Validation Error",
      description: "Validation Error",
      content: { "application/json": { schema: ApiError } },
    },
  },
});

export const CreateTodoRoute = createRoute({
  method: "post",
  path: "/todos",
  tags: ["Todos"],
  summary: "Create Todo",
  description: "Create a new todo item.",
  request: {
    body: { content: { "application/json": { schema: NewTodoBody } } },
  },
  responses: {
    201: {
      summary: "Created",
      description: "Todo created successfully.",
      content: { "application/json": { schema: Todo } },
    },
    409: {
      summary: "Conflict",
      description: "Conflict occurred while creating todo.",
      content: { "application/json": { schema: ApiError } },
    },
    422: {
      summary: "Validation Error",
      description: "Validation Error",
      content: { "application/json": { schema: ApiError } },
    },
  },
});

export const GetTodoRoute = createRoute({
  method: "get",
  path: "/todos/{todoId}",
  tags: ["Todos"],
  summary: "Get Todo by ID",
  description: "Retrieve a specific todo item by its ID.",
  request: { params: TodoIdParam },
  responses: {
    200: {
      summary: "OK",
      description: "The requested todo item.",
      content: { "application/json": { schema: Todo } },
    },
    404: {
      summary: "Not Found",
      description: "Todo item not found.",
      content: { "application/json": { schema: ApiError } },
    },
    422: {
      summary: "Validation Error",
      description: "Validation Error",
      content: { "application/json": { schema: ApiError } },
    },
  },
});

export const UpdateTodoRoute = createRoute({
  method: "put",
  path: "/todos/{todoId}",
  tags: ["Todos"],
  summary: "Update Todo",
  description: "Update an existing todo item by its ID.",
  request: {
    params: TodoIdParam,
    body: { content: { "application/json": { schema: UpdateTodoBody } } },
  },
  responses: {
    200: {
      summary: "Updated",
      description: "Todo item updated successfully.",
      content: { "application/json": { schema: Todo } },
    },
    404: {
      summary: "Not Found",
      description: "Todo item not found.",
      content: { "application/json": { schema: ApiError } },
    },
    422: {
      summary: "Validation Error",
      description: "Validation Error",
      content: { "application/json": { schema: ApiError } },
    },
  },
});

export const DeleteTodoRoute = createRoute({
  method: "delete",
  path: "/todos/{todoId}",
  tags: ["Todos"],
  summary: "Delete Todo",
  description: "Delete a specific todo item by its ID.",
  request: { params: TodoIdParam },
  responses: {
    204: {
      summary: "No Content",
      description: "Todo item deleted successfully.",
    },
    404: {
      summary: "Not Found",
      description: "Todo item not found.",
      content: { "application/json": { schema: ApiError } },
    },
    422: {
      summary: "Validation Error",
      description: "Validation Error",
      content: { "application/json": { schema: ApiError } },
    },
  },
});
