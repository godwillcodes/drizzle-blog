import "dotenv/config";
import { Pool } from "pg";
import { drizzle } from "drizzle-orm/node-postgres";
import * as schema from "@/db/schema";

// Validate base URL
const base = process.env.POSTGRES_URL;
if (!base || !base.startsWith("postgres://")) {
  throw new Error("POSTGRES_URL must be a valid postgres:// URL");
}

// Append sslmode only if not already present
const sslParam = "sslmode=no-verify";
const connectionString = base.includes("sslmode=")
  ? base
  : base.includes("?")
    ? `${base}&${sslParam}`
    : `${base}?${sslParam}`;

const pool = new Pool({ connectionString });
export const db = drizzle(pool, { schema });