import { z } from "@hono/zod-openapi";
import { createEnv } from "@t3-oss/env-core";

export const env = createEnv({
  server: {
    DATABASE_URL: z.string("Please provide a database URL").min(1),
  },
  runtimeEnv: process.env,
});
