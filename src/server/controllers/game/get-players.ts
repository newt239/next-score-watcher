import { createFactory } from "hono/factory";

import { getUserId } from "@/server/repositories/auth";
import { getGamePlayers } from "@/server/repositories/game";

const factory = createFactory();

/**
 * ゲームプレイヤー取得
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

    const players = await getGamePlayers(gameId, userId);
    return c.json(players);
  } catch (error) {
    console.error("Error fetching cloud game players:", error);
    return c.json({ error: "サーバーエラーが発生しました" } as const, 500);
  }
});

export default handler;
