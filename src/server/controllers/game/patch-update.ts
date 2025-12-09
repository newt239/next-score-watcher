import { zValidator } from "@hono/zod-validator";
import { createFactory } from "hono/factory";

import { UpdateGameRequestJsonSchema, UpdateGameRequestParamSchema } from "@/models/game";
import { getUserId } from "@/server/repositories/auth";
import { updateGameByKey } from "@/server/repositories/game";

const factory = createFactory();

/**
 * ゲーム更新
 */
const handler = factory.createHandlers(
  zValidator("param", UpdateGameRequestParamSchema),
  zValidator("json", UpdateGameRequestJsonSchema),
  async (c) => {
    try {
      const userId = await getUserId();
      if (!userId) {
        return c.json({ success: false, error: "ログインしてください" } as const, 401);
      }

      const { gameId } = c.req.valid("param");
      const jsonData = c.req.valid("json");
      const result = await updateGameByKey(
        {
          gameId,
          ...jsonData,
        },
        userId
      );

      return c.json(
        {
          result,
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
