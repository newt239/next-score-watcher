import { zValidator } from "@hono/zod-validator";
import { createFactory } from "hono/factory";

import { UpdateUserPreferencesRequestSchema } from "@/models/user-preferences";
import { getUserId } from "@/server/repositories/auth";
import {
  ensureUserPreferences,
  updateUserPreferencesByUserId,
} from "@/server/repositories/user";

const factory = createFactory();

/**
 * ユーザー設定更新
 */
const handler = factory.createHandlers(
  zValidator("json", UpdateUserPreferencesRequestSchema),
  async (c) => {
    try {
      const userId = await getUserId();
      if (!userId) {
        return c.json({ error: "ユーザーが見つかりません" } as const, 404);
      }

      const preferences = c.req.valid("json");

      // ユーザー設定が存在しない場合はデフォルト値で作成
      await ensureUserPreferences(userId);

      // 設定を更新
      await updateUserPreferencesByUserId(userId, preferences);

      return c.json({ success: true } as const);
    } catch (error) {
      console.error("Error updating user preferences:", error);
      return c.json({ error: "サーバーエラーが発生しました" } as const, 500);
    }
  }
);

export default handler;
