import { zValidator } from "@hono/zod-validator";
import { createFactory } from "hono/factory";

import { UpdateUserPreferencesSchema } from "@/models/user-preferences";
import { updateUserPreferencesByUserId } from "@/server/repositories/user-preferences";

const factory = createFactory();

/**
 * ユーザー設定更新
 */
const handler = factory.createHandlers(
  zValidator("json", UpdateUserPreferencesSchema),
  async (c) => {
    try {
      const userId = c.req.param("user_id");

      if (!userId) {
        return c.json({ error: "ユーザーIDが必要です" } as const, 400);
      }

      const preferences = c.req.valid("json");
      await updateUserPreferencesByUserId(userId, preferences);

      return c.json({ success: true } as const);
    } catch (error) {
      console.error("Error updating user preferences:", error);
      return c.json({ error: "サーバーエラーが発生しました" } as const, 500);
    }
  }
);

export default handler;
