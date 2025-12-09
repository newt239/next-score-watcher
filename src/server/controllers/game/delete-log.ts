import { createFactory } from "hono/factory";

import { getUserId } from "@/server/repositories/auth";
import { getGameLogById, removeGameLog, getGameById } from "@/server/repositories/game";
import { invalidateBoardCache } from "@/utils/cache/cache-service";
import { sendDiscordResetNotification } from "@/utils/online/discord";

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

    // ログ削除前にゲームIDとログ情報を取得
    const logInfo = await getGameLogById(logId, userId);

    if (!logInfo?.gameId) {
      return c.json({ error: "ログが見つかりません" } as const, 404);
    }

    // ログ削除前のゲーム状態を取得
    const gameDataBefore = await getGameById(logInfo.gameId, userId);
    const logCountBefore = gameDataBefore?.logs.length || 0;

    await removeGameLog(logId, userId);

    // ログ削除後のゲーム状態を取得
    const gameDataAfter = await getGameById(logInfo.gameId, userId);
    const logCountAfter = gameDataAfter?.logs.length || 0;

    // ログが公開ゲームのものの場合、キャッシュを無効化
    await invalidateBoardCache(logInfo.gameId);

    // ゲームリセット（全ログ削除）の場合にDiscord通知を送信
    if (gameDataAfter && logCountBefore > 0 && logCountAfter === 0) {
      try {
        await sendDiscordResetNotification(gameDataAfter);
      } catch (discordError) {
        // Discord通知の失敗は非致命的エラーとして扱う
        console.error("Discord reset notification failed:", discordError);
      }
    }

    return c.json({ success: true } as const);
  } catch (error) {
    console.error("Error removing cloud game log:", error);
    return c.json({ error: "サーバーエラーが発生しました" } as const, 500);
  }
});

export default handler;
