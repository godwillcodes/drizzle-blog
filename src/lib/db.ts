import "dotenv/config";
import { Pool } from "pg";
import { drizzle } from "drizzle-orm/node-postgres";
import * as schema from "@/db/schema";

function buildConnectionString(): string {
  const base = process.env.POSTGRES_URL;
  if (!base) {
    throw new Error("POSTGRES_URL is not defined");
  }
  if (!base.startsWith("postgres://") && !base.startsWith("postgresql://")) {
    throw new Error("POSTGRES_URL must start with postgres:// or postgresql://");
  }

  // Append sslmode if not provided
  const sslParam = "sslmode=require";
  if (base.includes("sslmode=")) return base;
  return base.includes("?") ? `${base}&${sslParam}` : `${base}?${sslParam}`;
}

let pool: Pool;
try {
  const connectionString = buildConnectionString();
  pool = new Pool({ connectionString });

  // Basic connection test on startup
  pool.query("SELECT 1").catch((err) => {
    console.error("Database connection failed:", err);
    process.exit(1);
  });
} catch (err) {
  console.error("Failed to initialize database pool:", err);
  process.exit(1);
}

export const db = drizzle(pool, { schema });

// Graceful shutdown
process.on("SIGINT", async () => {
  await pool.end();
  process.exit(0);
});
process.on("SIGTERM", async () => {
  await pool.end();
  process.exit(0);
});
