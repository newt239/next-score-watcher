import { createFactory } from "hono/factory";

import { getUserId } from "@/server/repositories/auth";
import { removeGameLog } from "@/server/repositories/game";

const factory = createFactory();

/**
 * ゲームログ削除
 */
const handler = factory.createHandlers(async (c) => {
  try {
    const logId = c.req.param("logId");
    const userId = await getUserId();

    if (!userId) {
      return c.json({ error: "認証が必要です" } as const, 401);
    }

    if (!logId) {
      return c.json({ error: "ログIDが必要です" } as const, 400);
    }

    await removeGameLog(logId, userId);

    return c.json({ success: true } as const);
  } catch (error) {
    console.error("Error removing cloud game log:", error);
    return c.json({ error: "サーバーエラーが発生しました" } as const, 500);
  }
});

export default handler;
