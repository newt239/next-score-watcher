import { zValidator } from "@hono/zod-validator";
import { createFactory } from "hono/factory";

import { UpdatePlayerRequestSchema } from "@/models/players";
import { getUserId } from "@/server/repositories/auth";
import { updatePlayer } from "@/server/repositories/players";

const factory = createFactory();

/**
 * プレイヤー更新APIハンドラー
 */
const handler = factory.createHandlers(
  zValidator("json", UpdatePlayerRequestSchema),
  async (c) => {
    const userId = await getUserId();
    if (!userId) {
      return c.json({ error: "認証が必要です" } as const, 401);
    }
    const playerId = c.req.param("id");
    const playerData = c.req.valid("json");

    if (!playerId) {
      return c.json(
        {
          success: false,
          error: "プレイヤーIDが指定されていません",
        } as const,
        400
      );
    }

    try {
      const success = await updatePlayer(playerId, playerData, userId);

      if (!success) {
        return c.json(
          {
            success: false,
            error: "プレイヤーが見つからないか、更新に失敗しました",
          } as const,
          404
        );
      }

      return c.json({
        success: true,
        message: "プレイヤーが正常に更新されました",
      } as const);
    } catch (error) {
      console.error("プレイヤー更新エラー:", error);
      return c.json(
        {
          success: false,
          error: "プレイヤーの更新に失敗しました",
        } as const,
        500
      );
    }
  }
);

export default handler;
