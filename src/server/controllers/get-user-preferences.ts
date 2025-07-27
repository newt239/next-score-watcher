import { zValidator } from "@hono/zod-validator";
import { createFactory } from "hono/factory";
import { z } from "zod";

import { getUserPreferences } from "@/utils/user-preferences";

const factory = createFactory();

export const getUserPreferencesHandler = factory.createHandlers(
  zValidator(
    "param",
    z.object({
      user_id: z.string(),
    })
  ),
  async (c) => {
    try {
      const { user_id } = c.req.valid("param");
      const preferences = await getUserPreferences(user_id);
      
      return c.json({ status: "success", data: preferences } as const, 200);
    } catch (error) {
      console.error("Failed to get user preferences:", error);
      return c.json({ status: "error", message: "Failed to get user preferences" } as const, 500);
    }
  }
);