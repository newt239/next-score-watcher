import { createFactory } from "hono/factory";

import { getUserId } from "@/server/repositories/auth";
import { getGame } from "@/server/repositories/games";

const factory = createFactory();

/**
 * クラウドゲーム詳細取得
 */
const handler = factory.createHandlers(async (c) => {
  try {
    const gameId = c.req.param("gameId");
    const userId = await getUserId();

    if (!userId) {
      return c.json({ error: "認証が必要です" } as const, 401);
    }

    if (!gameId) {
      return c.json({ error: "ゲームIDが必要です" } as const, 400);
    }

    const game = await getGame(gameId, userId);
    if (!game) {
      return c.json({ error: "ゲームが見つかりません" } as const, 404);
    }

    return c.json({ game } as const);
  } catch (error) {
    console.error("Error fetching cloud game:", error);
    return c.json({ error: "サーバーエラーが発生しました" } as const, 500);
  }
});

export default handler;
