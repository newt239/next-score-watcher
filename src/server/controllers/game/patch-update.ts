import { zValidator } from "@hono/zod-validator";
import { createFactory } from "hono/factory";

import { UpdateGameRequestSchema } from "@/models/games";
import { getUserId } from "@/server/repositories/auth";
import { updateGame } from "@/server/repositories/games";

const factory = createFactory();

/**
 * クラウドゲーム更新
 */
const handler = factory.createHandlers(
  zValidator("json", UpdateGameRequestSchema),
  async (c) => {
    try {
      const gameId = c.req.param("gameId");
      const userId = await getUserId();

      if (!userId) {
        return c.json({ error: "認証が必要です" } as const, 401);
      }

      if (!gameId) {
        return c.json({ error: "ゲームIDが必要です" } as const, 400);
      }

      const gameData = c.req.valid("json");
      await updateGame(gameId, gameData, userId);

      return c.json({ success: true } as const);
    } catch (error) {
      console.error("Error updating cloud game:", error);
      return c.json({ error: "サーバーエラーが発生しました" } as const, 500);
    }
  }
);

export default handler;
