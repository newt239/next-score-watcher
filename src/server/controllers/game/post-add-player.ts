import { zValidator } from "@hono/zod-validator";
import { createFactory } from "hono/factory";

import { AddPlayerToGameRequestSchema } from "@/models/games";
import { getUserId } from "@/server/repositories/auth";
import { addGamePlayer } from "@/server/repositories/game";

const factory = createFactory();

/**
 * ゲームプレイヤー追加
 */
const handler = factory.createHandlers(
  zValidator("json", AddPlayerToGameRequestSchema),
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

      const playerData = c.req.valid("json");
      const result = await addGamePlayer(gameId, playerData, userId);

      return c.json({ result } as const, 201);
    } catch (error) {
      console.error("Error adding cloud game player:", error);
      return c.json({ error: "サーバーエラーが発生しました" } as const, 500);
    }
  }
);

export default handler;
