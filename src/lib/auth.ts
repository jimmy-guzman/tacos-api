import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";

import db from "@/db/client";
import { openAPI } from "better-auth/plugins";
import * as schema from "@/db/schemas/auth-schema";

export const auth = betterAuth({
  basePath: "/auth",
  database: drizzleAdapter(db, {
    provider: "sqlite",
    schema: schema,
  }),
  plugins: [openAPI({ disableDefaultReference: true })],
});
