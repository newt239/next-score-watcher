import { zValidator } from "@hono/zod-validator";
import { eq } from "drizzle-orm";
import { createFactory } from "hono/factory";
import { z } from "zod";

import { DBClient } from "@/utils/drizzle/client";
import { userPreference } from "@/utils/drizzle/schema";
import { getUserPreferences } from "@/utils/user-preferences";

const factory = createFactory();

export const updateUserPreferencesHandler = factory.createHandlers(
  zValidator(
    "param",
    z.object({
      user_id: z.string(),
    })
  ),
  zValidator(
    "json",
    z.object({
      theme: z.enum(["light", "dark"]).optional(),
      showWinthroughPopup: z.boolean().optional(),
      showBoardHeader: z.boolean().optional(),
      showQn: z.boolean().optional(),
      showSignString: z.boolean().optional(),
      reversePlayerInfo: z.boolean().optional(),
      wrongNumber: z.boolean().optional(),
      webhookUrl: z.string().nullable().optional(),
    })
  ),
  async (c) => {
    try {
      const { user_id } = c.req.valid("param");
      const updates = c.req.valid("json");

      // 現在の設定を取得
      const currentPreferences = await DBClient.select()
        .from(userPreference)
        .where(eq(userPreference.userId, user_id))
        .limit(1);

      if (currentPreferences.length === 0) {
        return c.json({ status: "error", message: "User preferences not found" } as const, 404);
      }

      // 更新データを準備
      const updateData: Partial<typeof userPreference.$inferInsert> = {
        ...updates,
        updatedAt: new Date(),
      };

      // データベースを更新
      await DBClient.update(userPreference)
        .set(updateData)
        .where(eq(userPreference.userId, user_id));

      // 更新後の設定を取得して返す
      const updatedPreferences = await getUserPreferences(user_id);

      return c.json({ status: "success", data: updatedPreferences } as const, 200);
    } catch (error) {
      console.error("Failed to update user preferences:", error);
      return c.json({ status: "error", message: "Failed to update user preferences" } as const, 500);
    }
  }
);