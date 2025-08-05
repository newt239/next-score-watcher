import { zValidator } from "@hono/zod-validator";
import { createFactory } from "hono/factory";

import { AddGameLogRequestSchema } from "@/models/games";
import { addGameLog } from "@/server/repositories/games";

const factory = createFactory();

/**
 * クラウドゲームログ追加
 */
const handler = factory.createHandlers(
  zValidator("json", AddGameLogRequestSchema),
  async (c) => {
    try {
      const userId = c.req.header("x-user-id");

      if (!userId) {
        return c.json({ error: "認証が必要です" } as const, 401);
      }

      const logData = c.req.valid("json");
      const logId = await addGameLog(logData, userId);

      return c.json({ logId } as const, 201);
    } catch (error) {
      console.error("Error adding cloud game log:", error);
      return c.json({ error: "サーバーエラーが発生しました" } as const, 500);
    }
  }
);

export default handler;
