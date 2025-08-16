import { zValidator } from "@hono/zod-validator";
import { createFactory } from "hono/factory";

import { CreateGameRequestSchema } from "@/models/games";
import { getUserId } from "@/server/repositories/auth";
import { createGame } from "@/server/repositories/game";

const factory = createFactory();

/**
 * ゲーム作成
 */
const handler = factory.createHandlers(
  zValidator("json", CreateGameRequestSchema),
  async (c) => {
    try {
      const userId = await getUserId();
      if (!userId) {
        return c.json({ error: "認証が必要です" } as const, 401);
      }

      const gamesData = c.req.valid("json");
      const result = await createGame(gamesData, userId);

      return c.json(
        {
          success: true,
          data: {
            ids: result.ids,
            createdCount: result.createdCount,
            message: `${result.createdCount}件のゲームを作成しました`,
          },
        } as const,
        201
      );
    } catch (error) {
      console.error("ゲーム作成エラー:", error);
      return c.json(
        {
          success: false,
          error: "ゲームの作成に失敗しました",
        } as const,
        500
      );
    }
  }
);

export default handler;
