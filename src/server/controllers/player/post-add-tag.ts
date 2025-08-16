import { zValidator } from "@hono/zod-validator";
import { createFactory } from "hono/factory";

import { AddPlayerTagRequestSchema } from "@/models/players";
import { getUserId } from "@/server/repositories/auth";
import { addPlayerTag } from "@/server/repositories/player";

const factory = createFactory();

/**
 * プレイヤータグ追加APIハンドラー
 */
const handler = factory.createHandlers(
  zValidator("json", AddPlayerTagRequestSchema),
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
      const success = await addPlayerTag(playerId, tagData, userId);

      if (!success) {
        return c.json(
          {
            success: false,
            error: "タグの追加に失敗しました",
          } as const,
          500
        );
      }

      return c.json({
        success: true,
        message: "タグを追加しました",
      } as const);
    } catch (error) {
      console.error("プレイヤータグ追加エラー:", error);
      return c.json(
        {
          success: false,
          error: "タグの追加に失敗しました",
        } as const,
        500
      );
    }
  }
);

export default handler;
