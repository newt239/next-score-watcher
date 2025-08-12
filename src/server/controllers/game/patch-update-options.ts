import { zValidator } from "@hono/zod-validator";
import { createFactory } from "hono/factory";

import {
  UpdateGameOptionsRequestJsonSchema,
  UpdateGameOptionsRequestParamSchema,
} from "@/models/games";
import { getUserId } from "@/server/repositories/auth";
import { updateGameOptions } from "@/server/repositories/game";

const factory = createFactory();

/**
 * ゲームオプション更新エンドポイント
 */
export default factory.createHandlers(
  zValidator("param", UpdateGameOptionsRequestParamSchema),
  zValidator("json", UpdateGameOptionsRequestJsonSchema),
  async (c) => {
    try {
      const { gameId } = c.req.valid("param");
      const options = c.req.valid("json");
      const userId = await getUserId();

      if (!userId) {
        return c.json(
          {
            updated: false,
            message: "認証が必要です",
          } as const,
          401
        );
      }

      const result = await updateGameOptions(gameId, options, userId);

      if (!result) {
        return c.json(
          {
            updated: false,
            message: "ゲームが見つからないか、更新に失敗しました",
          } as const,
          404
        );
      }

      return c.json({
        updated: true,
        message: "ゲームオプションが正常に更新されました",
      } as const);
    } catch (error) {
      console.error("Failed to update game options:", error);
      return c.json(
        {
          updated: false,
          message: "ゲームオプションの更新中にエラーが発生しました",
        } as const,
        500
      );
    }
  }
);
