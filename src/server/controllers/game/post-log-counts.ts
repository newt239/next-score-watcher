import { zValidator } from "@hono/zod-validator";
import { createFactory } from "hono/factory";

import { GetGameCountsRequestSchema } from "@/models/games";
import { getGamesLogCounts } from "@/server/repositories/games";

const factory = createFactory();

/**
 * 複数ゲームのログ数取得
 */
const handler = factory.createHandlers(
  zValidator("json", GetGameCountsRequestSchema),
  async (c) => {
    try {
      const userId = c.req.header("x-user-id");
      if (!userId) {
        return c.json({ error: "認証が必要です" } as const, 401);
      }

      const { gameIds } = c.req.valid("json");
      const logCounts = await getGamesLogCounts(gameIds, userId);

      return c.json({ logCounts } as const);
    } catch (error) {
      console.error("Error fetching cloud games log counts:", error);
      return c.json({ error: "サーバーエラーが発生しました" } as const, 500);
    }
  }
);

export default handler;
