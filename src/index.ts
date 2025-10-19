import { serve } from "@hono/node-server";
import { Scalar } from "@scalar/hono-api-reference";
import { createMarkdownFromOpenApi } from "@scalar/openapi-to-markdown";
import { cors } from "hono/cors";
import { logger } from "hono/logger";
import { prettyJSON } from "hono/pretty-json";

import { openapi } from "./config/openapi";
import todos from "./routes/todos";
import { hono } from "./lib/hono";

const api = hono();

api.use(logger());
api.use(prettyJSON());
api.use(cors());

api.route("/", todos);

const content = api.getOpenAPI31Document({
  openapi: openapi.version,
  info: openapi.info,
});

const markdown = await createMarkdownFromOpenApi(JSON.stringify(content));

api.get("/docs", Scalar({ content, pageTitle: openapi.info.title }));
api.get("/openapi.json", (c) => c.json(content));
api.get("/llms.txt", (c) => c.text(markdown));
api.get("/", (c) => c.redirect("/docs", 301));

serve(
  {
    fetch: api.fetch,
    port: 3000,
  },
  (info) => {
    console.log(`Server is running on http://localhost:${info.port}`);
  },
);
