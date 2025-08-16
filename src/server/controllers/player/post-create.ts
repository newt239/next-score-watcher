import { zValidator } from "@hono/zod-validator";
import { createFactory } from "hono/factory";

import { CreatePlayerRequestSchema } from "@/models/player";
import { getUserId } from "@/server/repositories/auth";
import { createPlayer } from "@/server/repositories/player";

const factory = createFactory();

/**
 * プレイヤー作成
 */
const handler = factory.createHandlers(
  zValidator("json", CreatePlayerRequestSchema),
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
      const result = await createPlayer(playersData, userId);

      return c.json(
        {
          success: true,
          data: {
            ids: result.ids,
            createdCount: result.createdCount,
            message: `${result.createdCount}件のプレイヤーを作成しました`,
          },
        } as const,
        201
      );
    } catch (error) {
      console.error("プレイヤー作成エラー:", error);
      return c.json(
        {
          success: false,
          error: "プレイヤーの作成に失敗しました",
        } as const,
        500
      );
    }
  }
);

export default handler;
