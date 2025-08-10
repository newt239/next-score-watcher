import { createFactory } from "hono/factory";

import { getUserId } from "@/server/repositories/auth";
import { getGames } from "@/server/repositories/games";

const factory = createFactory();

/**
 * クラウドゲーム一覧取得
 */
const handler = factory.createHandlers(async (c) => {
  try {
    const userId = await getUserId();
    if (!userId) {
      return c.json({ error: "認証が必要です" } as const, 401);
    }

    const games = await getGames(userId);
    return c.json({ games } as const);
  } catch (error) {
    console.error("Error fetching cloud games:", error);
    return c.json({ error: "サーバーエラーが発生しました" } as const, 500);
  }
});

export default handler;
