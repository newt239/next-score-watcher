import { zValidator } from "@hono/zod-validator";
import { createFactory } from "hono/factory";

import { DeleteGameRequestSchema } from "@/models/games";
import { getUserId } from "@/server/repositories/auth";
import { deleteGame } from "@/server/repositories/games";

const factory = createFactory();

/**
 * ゲーム削除
 */
const handler = factory.createHandlers(
  zValidator("json", DeleteGameRequestSchema),
  async (c) => {
    try {
      const userId = await getUserId();
      if (!userId) {
        return c.json(
          { success: false, error: "ユーザーが見つかりません" } as const,
          404
        );
      }

      const gameIds = c.req.valid("json");
      const result = await deleteGame(gameIds, userId);

      return c.json(
        {
          success: true,
          data: {
            deletedCount: result.deletedCount,
            message: `${result.deletedCount}件のゲームを削除しました`,
          },
        } as const,
        200
      );
    } catch (error) {
      console.error("ゲーム削除エラー:", error);
      return c.json(
        {
          success: false,
          error: "ゲームの削除に失敗しました",
        } as const,
        500
      );
    }
  }
);

export default handler;
