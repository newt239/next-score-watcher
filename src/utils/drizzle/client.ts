import { drizzle } from "drizzle-orm/libsql";
import { createClient } from "@libsql/client";

import * as schema from "./schema";

const tursoUrl = process.env.TURSO_DATABASE_URL!;
const tursoToken = process.env.TURSO_AUTH_TOKEN!;

if (!tursoUrl) {
  throw new Error("TURSO_DATABASE_URL environment variable is required");
}

if (!tursoToken) {
  throw new Error("TURSO_AUTH_TOKEN environment variable is required");
}

// Turso接続設定
const client = createClient({
  url: tursoUrl,
  authToken: tursoToken,
});

// Drizzleクライアント初期化
export const db = drizzle(client, { schema });

export type DrizzleDB = typeof db;
export * from "./schema";
