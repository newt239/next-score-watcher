import { zValidator } from "@hono/zod-validator";
import { createFactory } from "hono/factory";

import {
  UpdateGamePlayersRequestJsonSchema,
  UpdateGamePlayersRequestParamSchema,
} from "@/models/game";
import { getUserId } from "@/server/repositories/auth";
import { updateGamePlayers } from "@/server/repositories/game";

const factory = createFactory();

/**
 * ゲームプレイヤー一括更新
 */
const handler = factory.createHandlers(
  zValidator("param", UpdateGamePlayersRequestParamSchema),
  zValidator("json", UpdateGamePlayersRequestJsonSchema),
  async (c) => {
    try {
      const userId = await getUserId();
      if (!userId) {
        return c.json({ success: false, error: "ログインしてください" } as const, 401);
      }

      const { gameId } = c.req.valid("param");
      const { players } = c.req.valid("json");

      const result = await updateGamePlayers(gameId, players, userId);

      return c.json(
        {
          updated: result.updatedCount > 0,
          updatedCount: result.updatedCount,
          message: `${result.updatedCount}人のプレイヤー設定を更新しました`,
        } as const,
        200
      );
    } catch (error) {
      console.error("ゲームプレイヤー一括更新エラー:", error);
      return c.json(
        {
          success: false,
          error: "プレイヤー設定の更新に失敗しました",
        } as const,
        500
      );
    }
  }
);

export default handler;
