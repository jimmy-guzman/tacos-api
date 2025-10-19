import { createEnv } from "@t3-oss/env-core";
import { z } from "@hono/zod-openapi";

export const env = createEnv({
  server: {
    DATABASE_URL: z.string().min(1),
  },
  runtimeEnv: process.env,
});
