import { zValidator } from "@hono/zod-validator";
import { createFactory } from "hono/factory";
import { z } from "zod";

import { UpdateGameSettingsRequestSchema } from "@/models/game";
import { getUserId } from "@/server/repositories/auth";
import { updateGameSettings } from "@/server/repositories/game";

const factory = createFactory();

/**
 * ゲーム設定更新API
 */
const handler = factory.createHandlers(
  zValidator("param", z.object({ gameId: z.string() })),
  zValidator("json", UpdateGameSettingsRequestSchema),
  async (c) => {
    const userId = await getUserId();
    const { gameId } = c.req.valid("param");
    const settingsData = c.req.valid("json");

    if (!userId) {
      return c.json({ error: "認証が必要です" } as const, 401);
    }

    try {
      const updated = await updateGameSettings(gameId, settingsData, userId);

      if (!updated) {
        return c.json({ error: "ゲーム設定の更新に失敗しました" } as const, 400);
      }

      return c.json({
        updated: true,
        message: "ゲーム設定を更新しました",
      } as const);
    } catch (error) {
      console.error("Failed to update game settings:", error);
      return c.json({ error: "ゲーム設定の更新に失敗しました" } as const, 500);
    }
  }
);

export default handler;
