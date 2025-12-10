import { zValidator } from "@hono/zod-validator";
import { createFactory } from "hono/factory";

import {
  UpdateGamePlayerRequestJsonSchema,
  UpdateGamePlayerRequestParamSchema,
} from "@/models/game";
import { getUserId } from "@/server/repositories/auth";
import { updateGamePlayerByKey } from "@/server/repositories/game";

const factory = createFactory();

/**
 * ゲームプレイヤー更新
 */
const handler = factory.createHandlers(
  zValidator("param", UpdateGamePlayerRequestParamSchema),
  zValidator("json", UpdateGamePlayerRequestJsonSchema),
  async (c) => {
    try {
      const userId = await getUserId();
      if (!userId) {
        return c.json({ success: false, error: "ログインしてください" } as const, 401);
      }

      const { gamePlayerId } = c.req.valid("param");
      const jsonData = c.req.valid("json");
      const result = await updateGamePlayerByKey(gamePlayerId, jsonData, userId);

      return c.json(
        {
          updated: result,
          message: result ? "プレイヤー設定を更新しました" : "プレイヤー設定の更新に失敗しました",
        } as const,
        200
      );
    } catch (error) {
      console.error("ゲームプレイヤー更新エラー:", error);
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
