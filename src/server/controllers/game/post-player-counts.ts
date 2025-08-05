import { zValidator } from "@hono/zod-validator";
import { createFactory } from "hono/factory";

import { GameCountsSchema } from "@/models/games";
import { getGamesPlayerCounts } from "@/server/repositories/games";

const factory = createFactory();

/**
 * 複数ゲームのプレイヤー数取得
 */
const handler = factory.createHandlers(
  zValidator("json", GameCountsSchema),
  async (c) => {
    try {
      const userId = c.req.header("x-user-id");
      if (!userId) {
        return c.json({ error: "認証が必要です" } as const, 401);
      }

      const { gameIds } = c.req.valid("json");
      const playerCounts = await getGamesPlayerCounts(gameIds, userId);

      return c.json({ playerCounts } as const);
    } catch (error) {
      console.error("Error fetching cloud games player counts:", error);
      return c.json({ error: "サーバーエラーが発生しました" } as const, 500);
    }
  }
);

export default handler;
