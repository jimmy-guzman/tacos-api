import "dotenv/config";
import { defineConfig } from "drizzle-kit";

import { env } from "./src/env";

export default defineConfig({
  dbCredentials: {
    url: env.DATABASE_URL,
  },
  dialect: "sqlite",
  out: "./drizzle",
  schema: "./src/db/schemas",
});
