import { createRoute, z } from "@hono/zod-openapi";

import { ApiError, NewTacoBody, Taco, UpdateTacoBody } from "./tacos.entities";

const TacoIdParam = z
  .object({
    tacoId: z.string().openapi({ example: "taco_01h2xcejqtf2nbrexx3vqjhp41" }),
  })
  .openapi("TacoIdParam");

export const ListTacosRoute = createRoute({
  method: "get",
  path: "/tacos",
  tags: ["Tacos"],
  summary: "List Tacos",
  description: "Retrieve a list of all tacos.",
  responses: {
    200: {
      summary: "OK",
      description: "List of tacos",
      content: { "application/json": { schema: z.array(Taco) } },
    },
  },
});

export const CreateTacoRoute = createRoute({
  method: "post",
  path: "/tacos",
  tags: ["Tacos"],
  summary: "Create Taco",
  description: "Create a new taco.",
  request: {
    body: { content: { "application/json": { schema: NewTacoBody } } },
  },
  responses: {
    201: {
      summary: "Created",
      description: "Taco created successfully.",
      content: { "application/json": { schema: Taco } },
    },
    422: {
      summary: "Validation Error",
      description: "Validation Error",
      content: { "application/json": { schema: ApiError } },
    },
  },
});

export const GetTacoRoute = createRoute({
  method: "get",
  path: "/tacos/{tacoId}",
  tags: ["Tacos"],
  summary: "Get Taco by ID",
  description: "Retrieve a specific taco by its ID.",
  request: { params: TacoIdParam },
  responses: {
    200: {
      summary: "OK",
      description: "The requested taco.",
      content: { "application/json": { schema: Taco } },
    },
    404: {
      summary: "Not Found",
      description: "Taco not found.",
      content: { "application/json": { schema: ApiError } },
    },
    422: {
      summary: "Validation Error",
      description: "Validation Error",
      content: { "application/json": { schema: ApiError } },
    },
  },
});

export const UpdateTacoRoute = createRoute({
  method: "patch",
  path: "/tacos/{tacoId}",
  tags: ["Tacos"],
  summary: "Update Taco",
  description: "Update an existing taco by its ID.",
  request: {
    params: TacoIdParam,
    body: { content: { "application/json": { schema: UpdateTacoBody } } },
  },
  responses: {
    200: {
      summary: "Updated",
      description: "Taco updated successfully.",
      content: { "application/json": { schema: Taco } },
    },
    404: {
      summary: "Not Found",
      description: "Taco not found.",
      content: { "application/json": { schema: ApiError } },
    },
    422: {
      summary: "Validation Error",
      description: "Validation Error",
      content: { "application/json": { schema: ApiError } },
    },
  },
});

export const DeleteTacoRoute = createRoute({
  method: "delete",
  path: "/tacos/{tacoId}",
  tags: ["Tacos"],
  summary: "Delete Taco",
  description: "Delete a specific taco by its ID.",
  request: { params: TacoIdParam },
  responses: {
    204: {
      summary: "No Content",
      description: "Taco deleted successfully.",
    },
    404: {
      summary: "Not Found",
      description: "Taco not found.",
      content: { "application/json": { schema: ApiError } },
    },
    422: {
      summary: "Validation Error",
      description: "Validation Error",
      content: { "application/json": { schema: ApiError } },
    },
  },
});
