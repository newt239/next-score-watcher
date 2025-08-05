import { createFactory } from "hono/factory";

import { getGameLogs } from "@/server/repositories/games";

const factory = createFactory();

/**
 * クラウドゲームログ取得
 */
const handler = factory.createHandlers(async (c) => {
  try {
    const gameId = c.req.param("gameId");
    const userId = c.req.header("x-user-id");

    if (!userId) {
      return c.json({ error: "認証が必要です" } as const, 401);
    }

    if (!gameId) {
      return c.json({ error: "ゲームIDが必要です" } as const, 400);
    }

    const logs = await getGameLogs(gameId, userId);
    return c.json({ logs } as const);
  } catch (error) {
    console.error("Error fetching cloud game logs:", error);
    return c.json({ error: "サーバーエラーが発生しました" } as const, 500);
  }
});

export default handler;
