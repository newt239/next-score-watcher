import { createFactory } from "hono/factory";

import { getUserPreferences } from "@/server/repositories/user-preferences";

const factory = createFactory();

/**
 * ユーザー設定取得
 */
const handler = factory.createHandlers(async (c) => {
  try {
    const userId = c.req.param("user_id");

    if (!userId) {
      return c.json({ error: "ユーザーIDが必要です" } as const, 400);
    }

    const preferences = await getUserPreferences(userId);

    return c.json({ preferences } as const);
  } catch (error) {
    console.error("Error fetching user preferences:", error);
    return c.json({ error: "サーバーエラーが発生しました" } as const, 500);
  }
});

export default handler;
