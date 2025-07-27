import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";

import * as schema from "./schema";

const connectionString = process.env.DATABASE_URL!;

if (!connectionString) {
  throw new Error("DATABASE_URL environment variable is required");
}

// PostgreSQL接続設定
const client = postgres(connectionString, {
  prepare: false,
  ssl: process.env.NODE_ENV === "production" ? "require" : false,
});

// Drizzleクライアント初期化
export const db = drizzle(client, { schema });

export type DrizzleDB = typeof db;
export * from "./schema";
