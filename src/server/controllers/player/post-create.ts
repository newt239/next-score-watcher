import { createFactory } from "hono/factory";

import { CreatePlayerRequestSchema } from "@/models/players";
import { createPlayer } from "@/server/repositories/players";

const factory = createFactory();

/**
 * プレイヤー作成
 */
const handler = factory.createHandlers(async (c) => {
  const userId = c.req.header("x-user-id");
  if (!userId) {
    return c.json(
      {
        success: false,
        error: "認証が必要です",
      } as const,
      401
    );
  }

  const body = await c.req.json();
  const parseResult = CreatePlayerRequestSchema.safeParse(body);

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
});

export default handler;
