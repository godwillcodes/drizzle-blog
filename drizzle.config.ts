import { defineConfig } from "drizzle-kit";

// Ensure env var is set, fail fast if missing
const url = process.env.POSTGRES_URL;
if (!url) {
  throw new Error("POSTGRES_URL environment variable is not defined.");
}

export default defineConfig({
  schema: "./src/db/schema.ts", // path to schema definitions
  out: "./drizzle",             // where migrations are generated
  dialect: "postgresql",        // database type
  dbCredentials: {
    url,                        // connection string from env
    ssl: process.env.NODE_ENV === "production"
      ? { rejectUnauthorized: false } // allow SSL in prod/cloud
      : undefined,                    // no SSL locally
  },
});
