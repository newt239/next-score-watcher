import { zValidator } from "@hono/zod-validator";
import { createFactory } from "hono/factory";

import { CreatePlayerRequestSchema } from "@/models/players";
import { createPlayer } from "@/server/repositories/players";
import { requireAuth } from "@/server/utils/auth";

const factory = createFactory();

/**
 * プレイヤー作成
 */
const handler = factory.createHandlers(
  zValidator("json", CreatePlayerRequestSchema),
  async (c) => {
    const authResult = requireAuth(c);
    if ("status" in authResult) {
      return authResult; // 401エラーレスポンス
    }

    const { userId } = authResult;
    const playerData = c.req.valid("json");

    console.log("バリデーション後のプレイヤーデータ:", playerData);

    try {
      const playerId = await createPlayer(playerData, userId);

      return c.json(
        {
          success: true,
          data: {
            id: playerId,
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
