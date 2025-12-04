import { z } from "@hono/zod-openapi";
import { createEnv } from "@t3-oss/env-core";

export const env = createEnv({
  server: {
    DATABASE_URL: z.string("Please provide a database URL").min(1),
    BETTER_AUTH_SECRET: z
      .string("Please provide a secret for Better Auth")
      .min(1),
    BETTER_AUTH_URL: z
      .url("Please provide a valid URL for Better Auth")
      .min(1)
      .default("http://localhost:3000"),
    RESEND_FROM_EMAIL: z
      .email("Please provide a verified email address")
      .min(1),
    RESEND_API_KEY: z
      .string(
        "Please provide a Resend API key, available from https://resend.com/api-keys",
      )
      .min(1),
  },
  runtimeEnv: process.env,
});
