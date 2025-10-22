import { Scalar } from "@scalar/hono-api-reference";
import { createMarkdownFromOpenApi } from "@scalar/openapi-to-markdown";
import type { Swagger } from "atlassian-openapi";
import { cors } from "hono/cors";
import { logger } from "hono/logger";
import { prettyJSON } from "hono/pretty-json";
import { isErrorResult, merge } from "openapi-merge";

import { humanDescription, llmIndexMarkdown, openapi } from "./config/docs";
import { auth } from "./lib/auth";
import { hono } from "./lib/hono";
import todos from "./routes/todos";

const api = hono();

api.use(logger());
api.use(prettyJSON());
api.use(cors());

api.on(["POST", "GET"], "/auth/*", (c) => auth.handler(c.req.raw));

api.route("/", todos);

const apiSchema = api.getOpenAPI31Document({
  openapi: openapi.version,
  info: openapi.info,
});

const authSchema = await auth.api.generateOpenAPISchema();

const mergedResult = merge([
  { oas: apiSchema as Swagger.SwaggerV3 },
  {
    oas: authSchema as Swagger.SwaggerV3,
    pathModification: { prepend: "/auth" },
  },
]);

if (isErrorResult(mergedResult)) {
  throw new Error(`Failed to merge OpenAPI schemas: ${mergedResult.message}`);
}

const [apiMarkdown, authMarkdown] = await Promise.all([
  createMarkdownFromOpenApi(JSON.stringify(apiSchema)),
  createMarkdownFromOpenApi(JSON.stringify(authSchema)),
]);

api.get(
  "/docs",
  Scalar({
    pageTitle: openapi.info.title,
    sources: [
      {
        content: {
          ...apiSchema,
          info: { ...openapi.info, description: humanDescription },
        },
        title: "API",
      },
      { content: authSchema, title: "Auth" },
    ],
  }),
);

api.get("/openapi.json", (c) => c.json(mergedResult.output));

api.get("/llms.txt", (c) => {
  c.header("Content-Type", "text/plain; charset=utf-8");

  return c.text(llmIndexMarkdown);
});

api.get("/api-llms.txt", (c) => {
  c.header("Content-Type", "text/plain; charset=utf-8");

  return c.text(apiMarkdown);
});

api.get("/auth-llms.txt", (c) => {
  c.header("Content-Type", "text/plain; charset=utf-8");

  return c.text(authMarkdown);
});

api.get("/", (c) => c.redirect("/docs", 301));

export default api;
