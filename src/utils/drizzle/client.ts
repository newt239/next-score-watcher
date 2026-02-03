import { createClient } from "@libsql/client";
import { drizzle } from "drizzle-orm/libsql";

import * as schema from "./schema/index";

const tursoUrl = process.env.TURSO_DATABASE_URL!;
const tursoToken = process.env.TURSO_AUTH_TOKEN!;

// Turso接続設定
const sqlClient = createClient({
  url: tursoUrl,
  authToken: tursoToken,
});

// Drizzleクライアント初期化
export const DBClient = drizzle(sqlClient, { schema });

export type DrizzleDB = typeof DBClient;
export * from "./schema";
