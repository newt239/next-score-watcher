import { zValidator } from "@hono/zod-validator";
import { createFactory } from "hono/factory";

import { CreatePlayerSchema } from "@/models/players";
import { createPlayer } from "@/server/repositories/players";

const factory = createFactory();

/**
 * プレイヤー作成
 */
const handler = factory.createHandlers(
  zValidator("json", CreatePlayerSchema),
  async (c) => {
    try {
      const userId = c.req.header("x-user-id");
      if (!userId) {
        return c.json({ error: "認証が必要です" } as const, 401);
      }

      const playerData = c.req.valid("json");
      const playerId = await createPlayer(playerData, userId);

      return c.json({ playerId } as const, 201);
    } catch (error) {
      console.error("Error creating cloud player:", error);
      return c.json({ error: "サーバーエラーが発生しました" } as const, 500);
    }
  }
);

export default handler;
