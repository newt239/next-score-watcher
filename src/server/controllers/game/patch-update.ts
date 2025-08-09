import { zValidator } from "@hono/zod-validator";
import { createFactory } from "hono/factory";

import { UpdateGameRequestSchema } from "@/models/games";
import { getUserId } from "@/server/repositories/auth";
import { updateGame } from "@/server/repositories/games";

const factory = createFactory();

/**
 * ゲーム更新
 */
const handler = factory.createHandlers(
  zValidator("json", UpdateGameRequestSchema),
  async (c) => {
    try {
      const userId = await getUserId();
      if (!userId) {
        return c.json(
          { success: false, error: "ユーザーが見つかりません" } as const,
          404
        );
      }

      const gamesData = c.req.valid("json");
      const result = await updateGame(gamesData, userId);

      return c.json(
        {
          success: true,
          data: {
            updatedCount: result.updatedCount,
            message: `${result.updatedCount}件のゲームを更新しました`,
          },
        } as const,
        200
      );
    } catch (error) {
      console.error("ゲーム更新エラー:", error);
      return c.json(
        {
          success: false,
          error: "ゲームの更新に失敗しました",
        } as const,
        500
      );
    }
  }
);

export default handler;
