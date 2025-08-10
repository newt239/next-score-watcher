import { zValidator } from "@hono/zod-validator";
import { createFactory } from "hono/factory";
import { z } from "zod";

import { GetGameSettingsResponseSchema } from "@/models/games";
import { getUserId } from "@/server/repositories/auth";
import { getGameSettings } from "@/server/repositories/games";

const factory = createFactory();

/**
 * ゲーム設定取得API
 */
const handler = factory.createHandlers(
  zValidator("param", z.object({ gameId: z.string() })),
  async (c) => {
    const userId = await getUserId();
    const { gameId } = c.req.valid("param");

    if (!userId) {
      return c.json({ error: "認証が必要です" } as const, 401);
    }

    try {
      const settings = await getGameSettings(gameId, userId);

      if (!settings) {
        return c.json({ error: "ゲームが見つかりません" } as const, 404);
      }

      const validatedSettings = GetGameSettingsResponseSchema.parse(settings);

      return c.json({
        settings: validatedSettings,
        message: "ゲーム設定を取得しました",
      } as const);
    } catch (error) {
      console.error("Failed to get game settings:", error);
      return c.json({ error: "ゲーム設定の取得に失敗しました" } as const, 500);
    }
  }
);

export default handler;
