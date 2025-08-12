import { zValidator } from "@hono/zod-validator";
import { createFactory } from "hono/factory";

import { GetPlayersListRequestSchema } from "@/models/players";
import { getUserId } from "@/server/repositories/auth";
import { getPlayers } from "@/server/repositories/player";

const factory = createFactory();

/**
 * プレイヤー一覧取得
 */
const handler = factory.createHandlers(
  zValidator("query", GetPlayersListRequestSchema),
  async (c) => {
    const userId = await getUserId();
    if (!userId) {
      return c.json({ error: "ログインしてください" } as const, 401);
    }

    const players = await getPlayers(userId);
    return c.json(players, 200);
  }
);

export default handler;
