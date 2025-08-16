import { zValidator } from "@hono/zod-validator";
import { createFactory } from "hono/factory";

import { DeletePlayerRequestSchema } from "@/models/player";
import { getUserId } from "@/server/repositories/auth";
import { deletePlayer } from "@/server/repositories/player";

const factory = createFactory();

/**
 * プレイヤー削除
 */
const handler = factory.createHandlers(
  zValidator("json", DeletePlayerRequestSchema),
  async (c) => {
    try {
      const userId = await getUserId();
      if (!userId) {
        return c.json(
          { success: false, error: "ユーザーが見つかりません" } as const,
          404
        );
      }

      const playerIds = c.req.valid("json");
      const result = await deletePlayer(playerIds, userId);

      return c.json(
        {
          success: true,
          data: {
            deletedPlayerIds: result,
            message: `${result.length}件のプレイヤーを削除しました`,
          },
        } as const,
        200
      );
    } catch (error) {
      console.error("プレイヤー削除エラー:", error);
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
