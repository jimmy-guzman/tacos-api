import { Scalar } from "@scalar/hono-api-reference";
import { createMarkdownFromOpenApi } from "@scalar/openapi-to-markdown";
import { cors } from "hono/cors";
import { logger } from "hono/logger";
import { prettyJSON } from "hono/pretty-json";

import { humanDescription, llmIndexMarkdown, openapi } from "./config/docs";
import { auth } from "./lib/auth";
import { hono } from "./lib/hono";
import { mergeSchemas, prependPath } from "./lib/openapi";
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

const combinedSchemas = mergeSchemas([
  { oas: apiSchema },
  { oas: authSchema, basePath: "/auth" },
]);

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
      {
        content: prependPath(authSchema, "/auth"),
        title: "Auth",
      },
    ],
  }),
);

api.get("/openapi.json", (c) => c.json(combinedSchemas));

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
