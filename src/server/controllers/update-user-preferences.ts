import { zValidator } from "@hono/zod-validator";
import { createFactory } from "hono/factory";

import {
  existsUserPreferencesByUserId,
  updateUserPreferencesByUserId,
  getUserPreferences,
} from "../repositories/user-preferences";

import {
  userIdParamSchema,
  updateUserPreferencesSchema,
} from "@/server/models/user-preferences";

const factory = createFactory();

const updateUserPreferencesHandler = factory.createHandlers(
  zValidator("param", userIdParamSchema),
  zValidator("json", updateUserPreferencesSchema),
  async (c) => {
    try {
      const { user_id } = c.req.valid("param");
      const updates = c.req.valid("json");

      // ユーザー設定が存在するかチェック
      const exists = await existsUserPreferencesByUserId(user_id);
      if (!exists) {
        return c.json(
          { status: "error", message: "User preferences not found" } as const,
          404
        );
      }

      // データベースを更新
      await updateUserPreferencesByUserId(user_id, updates);

      // 更新後の設定を取得して返す
      const updatedPreferences = await getUserPreferences(user_id);

      return c.json(
        { status: "success", data: updatedPreferences } as const,
        200
      );
    } catch (error) {
      console.error("Failed to update user preferences:", error);
      return c.json(
        {
          status: "error",
          message: "Failed to update user preferences",
        } as const,
        500
      );
    }
  }
);

export default updateUserPreferencesHandler;
