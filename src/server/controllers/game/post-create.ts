import { zValidator } from "@hono/zod-validator";
import { createFactory } from "hono/factory";

import { CreateGameRequestSchema } from "@/models/games";
import { getUserId } from "@/server/repositories/auth";
import { createGame } from "@/server/repositories/games";

const factory = createFactory();

/**
 * クラウドゲーム作成
 */
const handler = factory.createHandlers(
  zValidator("json", CreateGameRequestSchema),
  async (c) => {
    try {
      const userId = await getUserId();
      if (!userId) {
        return c.json({ error: "認証が必要です" } as const, 401);
      }

      const gameData = c.req.valid("json");
      const gameId = await createGame(gameData, userId);

      return c.json({ gameId } as const, 201);
    } catch (error) {
      console.error("Error creating cloud game:", error);
      return c.json({ error: "サーバーエラーが発生しました" } as const, 500);
    }
  }
);

export default handler;
