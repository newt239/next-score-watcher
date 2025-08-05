import { zValidator } from "@hono/zod-validator";
import { createFactory } from "hono/factory";

import { createPlayerSchema } from "@/server/models/cloud-players";
import {
  getCloudPlayers,
  createCloudPlayer,
} from "@/server/repositories/cloud-players";

const factory = createFactory();

/**
 * プレイヤー一覧取得
 */
export const getCloudPlayersHandler = factory.createHandlers(async (c) => {
  try {
    const userId = c.req.header("x-user-id");
    if (!userId) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    const players = await getCloudPlayers(userId);
    return c.json({ players });
  } catch (error) {
    console.error("Error fetching cloud players:", error);
    return c.json({ error: "Internal server error" }, 500);
  }
});

/**
 * プレイヤー作成
 */
export const createCloudPlayerHandler = factory.createHandlers(
  zValidator("json", createPlayerSchema),
  async (c) => {
    try {
      const userId = c.req.header("x-user-id");
      if (!userId) {
        return c.json({ error: "Unauthorized" }, 401);
      }

      const playerData = c.req.valid("json");
      const playerId = await createCloudPlayer(playerData, userId);

      return c.json({ playerId }, 201);
    } catch (error) {
      console.error("Error creating cloud player:", error);
      return c.json({ error: "Internal server error" }, 500);
    }
  }
);
