import { createFactory } from "hono/factory";

import { UpdatePlayerSchema } from "@/models/players";
import { updatePlayer } from "@/server/repositories/players";

const factory = createFactory();

/**
 * プレイヤー更新APIハンドラー
 */
const handler = factory.createHandlers(async (c) => {
  const userId = c.req.header("x-user-id");
  if (!userId) {
    return c.json({ error: "認証が必要です" } as const, 401);
  }
  const playerId = c.req.param("id");
  const body = await c.req.json();
  const parseResult = UpdatePlayerSchema.safeParse(body);

  if (!parseResult.success) {
    return c.json(
      {
        success: false,
        error: "無効なリクエストデータです",
        details: parseResult.error.issues,
      } as const,
      400
    );
  }

  const playerData = parseResult.data;

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
});

export default handler;
