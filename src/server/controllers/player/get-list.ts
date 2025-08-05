import { createFactory } from "hono/factory";

import { getPlayers } from "@/server/repositories/players";

const factory = createFactory();

/**
 * プレイヤー一覧取得
 */
const handler = factory.createHandlers(async (c) => {
  try {
    const userId = c.req.header("x-user-id");
    if (!userId) {
      return c.json({ error: "認証が必要です" } as const, 401);
    }

    const players = await getPlayers(userId);
    return c.json({ players } as const);
  } catch (error) {
    console.error("Error fetching cloud players:", error);
    return c.json({ error: "サーバーエラーが発生しました" } as const, 500);
  }
});

export default handler;
