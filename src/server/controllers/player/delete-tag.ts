import { zValidator } from "@hono/zod-validator";
import { createFactory } from "hono/factory";

import { RemovePlayerTagRequestSchema } from "@/models/players";
import { getUserId } from "@/server/repositories/auth";
import { removePlayerTag } from "@/server/repositories/players";

const factory = createFactory();

/**
 * プレイヤータグ削除APIハンドラー
 */
const handler = factory.createHandlers(
  zValidator("json", RemovePlayerTagRequestSchema),
  async (c) => {
    const userId = await getUserId();
    if (!userId) {
      return c.json({ error: "認証が必要です" } as const, 401);
    }

    const playerId = c.req.param("id");
    if (!playerId) {
      return c.json(
        {
          success: false,
          error: "プレイヤーIDが指定されていません",
        } as const,
        400
      );
    }

    const tagData = c.req.valid("json");

    try {
      const success = await removePlayerTag(playerId, tagData, userId);

      if (!success) {
        return c.json(
          {
            success: false,
            error: "タグの削除に失敗しました",
          } as const,
          404
        );
      }

      return c.json({
        success: true,
        message: "タグを削除しました",
      } as const);
    } catch (error) {
      console.error("プレイヤータグ削除エラー:", error);
      return c.json(
        {
          success: false,
          error: "タグの削除に失敗しました",
        } as const,
        500
      );
    }
  }
);

export default handler;
