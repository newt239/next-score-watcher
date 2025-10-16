import { zValidator } from "@hono/zod-validator";
import { createFactory } from "hono/factory";

import { DeleteGameRequestParamSchema } from "@/models/game";
import { getUserId } from "@/server/repositories/auth";
import { deleteGameById } from "@/server/repositories/game";

const factory = createFactory();

/**
 * ゲーム削除
 */
const handler = factory.createHandlers(
  zValidator("param", DeleteGameRequestParamSchema),
  async (c) => {
    try {
      const userId = await getUserId();
      if (!userId) {
        return c.json({ error: "ユーザーが見つかりません" } as const, 404);
      }

      const { gameId } = c.req.valid("param");
      const result = await deleteGameById(gameId, userId);

      return c.json({ success: result } as const, 200);
    } catch (error) {
      console.error("ゲーム削除エラー:", error);
      return c.json(
        {
          error: "ゲームの削除に失敗しました",
        } as const,
        500
      );
    }
  }
);

export default handler;
