import { zValidator } from "@hono/zod-validator";
import { createFactory } from "hono/factory";
import { z } from "zod";

import { UserPreferencesRepository } from "../repositories/user-preferences";

const factory = createFactory();

const updateUserPreferencesHandler = factory.createHandlers(
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

      // ユーザー設定が存在するかチェック
      const exists = await UserPreferencesRepository.existsByUserId(user_id);
      if (!exists) {
        return c.json(
          { status: "error", message: "User preferences not found" } as const,
          404
        );
      }

      // データベースを更新
      await UserPreferencesRepository.updateByUserId(user_id, updates);

      // 更新後の設定を取得して返す
      const updatedPreferences =
        await UserPreferencesRepository.getUserPreferences(user_id);

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
