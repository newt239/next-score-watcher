import { createFactory } from "hono/factory";

import { getUserId } from "@/server/repositories/auth";
import { getPlayerById } from "@/server/repositories/player";

const factory = createFactory();

/**
 * プレイヤー詳細取得APIハンドラー
 */
const handler = factory.createHandlers(async (c) => {
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

  try {
    const player = await getPlayerById(playerId, userId);

    if (!player) {
      return c.json(
        {
          success: false,
          error: "プレイヤーが見つかりません",
        } as const,
        404
      );
    }

    return c.json({
      success: true,
      data: player,
    } as const);
  } catch (error) {
    console.error("プレイヤー詳細取得エラー:", error);
    return c.json(
      {
        success: false,
        error: "プレイヤー詳細の取得に失敗しました",
      } as const,
      500
    );
  }
});

export default handler;
