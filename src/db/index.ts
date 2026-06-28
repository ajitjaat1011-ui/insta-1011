import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  throw new Error("DATABASE_URL is required");
}

const globalForDb = globalThis as typeof globalThis & {
  __pool?: Pool;
};

export const pool =
  globalForDb.__pool ??
  new Pool({
    connectionString: databaseUrl,
    // Neon requires SSL in production
    ssl: databaseUrl.includes("neon.tech") ? { rejectUnauthorized: false } : undefined,
  });

if (process.env.NODE_ENV !== "production") {
  globalForDb.__pool = pool;
}

export const db = drizzle(pool);
