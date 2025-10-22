import { Database } from "bun:sqlite";
import { drizzle } from "drizzle-orm/bun-sqlite";

import { env } from "@/env";

const sqlite = new Database(env.DATABASE_URL);
const db = drizzle({ client: sqlite });

export default db;
