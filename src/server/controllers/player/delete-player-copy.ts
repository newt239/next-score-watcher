import { createFactory } from "hono/factory";

import { getUserId } from "@/server/repositories/auth";
import { deletePlayer } from "@/server/repositories/players";

const factory = createFactory();

/**
 * プレイヤー削除APIハンドラー
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
    const success = await deletePlayer(playerId, userId);

    if (!success) {
      return c.json(
        {
          success: false,
          error: "プレイヤーが見つからないか、削除に失敗しました",
        } as const,
        404
      );
    }

    return c.json({
      success: true,
      message: "プレイヤーが正常に削除されました",
    } as const);
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
});

export default handler;
