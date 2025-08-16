import { zValidator } from "@hono/zod-validator";
import { createFactory } from "hono/factory";

import { UpdatePlayerRequestSchema } from "@/models/players";
import { getUserId } from "@/server/repositories/auth";
import { updatePlayer } from "@/server/repositories/player";

const factory = createFactory();

/**
 * プレイヤー更新
 */
const handler = factory.createHandlers(
  zValidator("json", UpdatePlayerRequestSchema),
  async (c) => {
    try {
      const userId = await getUserId();
      if (!userId) {
        return c.json(
          { success: false, error: "ユーザーが見つかりません" } as const,
          404
        );
      }

      const playersData = c.req.valid("json");
      const result = await updatePlayer(playersData, userId);

      return c.json(
        {
          success: true,
          data: {
            updatedCount: result.updatedCount,
            message: `${result.updatedCount}件のプレイヤーを更新しました`,
          },
        } as const,
        200
      );
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
