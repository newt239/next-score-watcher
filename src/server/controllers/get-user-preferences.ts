import { zValidator } from "@hono/zod-validator";
import { createFactory } from "hono/factory";
import { z } from "zod";

import {
  UserPreferencesRepository,
  defaultUserPreferences,
} from "../repositories/user-preferences";

const factory = createFactory();

const getUserPreferencesHandler = factory.createHandlers(
  zValidator(
    "param",
    z.object({
      user_id: z.string(),
    })
  ),
  async (c) => {
    try {
      const { user_id } = c.req.valid("param");
      const preferences = await UserPreferencesRepository.findByUserId(user_id);

      // 設定が存在しない場合はデフォルト値を返す
      const result = preferences || defaultUserPreferences;

      return c.json({ status: "success", data: result } as const, 200);
    } catch (error) {
      console.error("Failed to get user preferences:", error);
      return c.json(
        { status: "error", message: "Failed to get user preferences" } as const,
        500
      );
    }
  }
);

export default getUserPreferencesHandler;
