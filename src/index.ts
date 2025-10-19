import { cors } from "hono/cors";
import { logger } from "hono/logger";
import { prettyJSON } from "hono/pretty-json";
import { Scalar } from "@scalar/hono-api-reference";
import { createMarkdownFromOpenApi } from "@scalar/openapi-to-markdown";
import { isErrorResult, merge } from "openapi-merge";
import type { Swagger } from "atlassian-openapi";

import { openapi } from "./config/openapi";
import todos from "./routes/todos";
import { hono } from "./lib/hono";
import { auth } from "./lib/auth";

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

const combinedMarkdown = `# Full API Documentation

${apiMarkdown.replace(/^#/gm, "##")}

---

${authMarkdown.replace(/^#/gm, "##")}`;

api.get(
  "/docs",
  Scalar({
    pageTitle: openapi.info.title,
    sources: [
      { content: apiSchema, title: "API" },
      { content: authSchema, title: "Auth" },
    ],
  }),
);

api.get("/openapi.json", (c) => c.json(mergedResult.output));

api.get("/llms.txt", (c) => {
  c.header("Content-Type", "text/plain; charset=utf-8");
  return c.text(combinedMarkdown);
});

api.get("/", (c) => c.redirect("/docs", 301));

export default api;
