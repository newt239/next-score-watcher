import { zValidator } from "@hono/zod-validator";
import { createFactory } from "hono/factory";

import {
  RemoveGamePlayersRequestJsonSchema,
  RemoveGamePlayersRequestParamSchema,
} from "@/models/game";
import { getUserId } from "@/server/repositories/auth";
import { removeGamePlayers } from "@/server/repositories/game";

const factory = createFactory();

/**
 * ゲームプレイヤー削除
 */
const handler = factory.createHandlers(
  zValidator("param", RemoveGamePlayersRequestParamSchema),
  zValidator("json", RemoveGamePlayersRequestJsonSchema),
  async (c) => {
    try {
      const userId = await getUserId();
      if (!userId) {
        return c.json(
          { success: false, error: "ログインしてください" } as const,
          401
        );
      }

      const { gameId } = c.req.valid("param");
      const { playerIds } = c.req.valid("json");

      const result = await removeGamePlayers(gameId, playerIds, userId);

      return c.json(
        {
          removed: result.deletedCount > 0,
          deletedCount: result.deletedCount,
          message: `${result.deletedCount}人のプレイヤーを削除しました`,
        } as const,
        200
      );
    } catch (error) {
      console.error("ゲームプレイヤー削除エラー:", error);
      return c.json(
        {
          success: false,
          error: "プレイヤーの削除に失敗しました",
        } as const,
        500
      );
    }
  }
);

export default handler;
