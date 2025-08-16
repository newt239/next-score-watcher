import { createFactory } from "hono/factory";

import { getUserId } from "@/server/repositories/auth";
import { getGameLogById, removeGameLog } from "@/server/repositories/game";
import { invalidateBoardCache } from "@/utils/cache/cache-service";

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

    // ログ削除前にゲームIDを取得
    const logInfo = await getGameLogById(logId, userId);

    await removeGameLog(logId, userId);

    // ログが公開ゲームのものの場合、キャッシュを無効化
    if (logInfo?.gameId) {
      await invalidateBoardCache(logInfo.gameId);
    }

    return c.json({ success: true } as const);
  } catch (error) {
    console.error("Error removing cloud game log:", error);
    return c.json({ error: "サーバーエラーが発生しました" } as const, 500);
  }
});

export default handler;
