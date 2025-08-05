import { zValidator } from "@hono/zod-validator";
import { createFactory } from "hono/factory";
import { z } from "zod";

import type { RuleNames, Variants } from "@/utils/types";

import {
  getCloudGames,
  getCloudGame,
  createCloudGame,
  updateCloudGame,
  deleteCloudGame,
  getCloudGamePlayers,
  addCloudGamePlayer,
  getCloudGameLogs,
  addCloudGameLog,
  removeCloudGameLog,
} from "@/utils/cloud-db";

const factory = createFactory();

// スキーマ定義
const createGameSchema = z.object({
  name: z.string().min(1),
  ruleType: z.string() as z.ZodSchema<RuleNames>,
  discordWebhookUrl: z.string().optional(),
});

const updateGameSchema = z.object({
  name: z.string().min(1).optional(),
  discordWebhookUrl: z.string().optional(),
});

const addPlayerSchema = z.object({
  playerId: z.string().min(1),
  displayOrder: z.number().int().min(0),
  initialScore: z.number().int().default(0),
  initialCorrectCount: z.number().int().default(0),
  initialWrongCount: z.number().int().default(0),
});

const addLogSchema = z.object({
  gameId: z.string().min(1),
  playerId: z.string().min(1),
  questionNumber: z.number().int().optional(),
  actionType: z.string() as z.ZodSchema<Variants>,
  scoreChange: z.number().int().default(0),
  isSystemAction: z.boolean().default(false),
});

/**
 * クラウドゲーム一覧取得
 */
export const getCloudGamesHandler = factory.createHandlers(async (c) => {
  try {
    const userId = c.req.header("x-user-id");
    if (!userId) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    const games = await getCloudGames(userId);
    return c.json({ games });
  } catch (error) {
    console.error("Error fetching cloud games:", error);
    return c.json({ error: "Internal server error" }, 500);
  }
});

/**
 * クラウドゲーム詳細取得
 */
export const getCloudGameHandler = factory.createHandlers(async (c) => {
  try {
    const gameId = c.req.param("gameId");
    const userId = c.req.header("x-user-id");

    if (!userId) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    if (!gameId) {
      return c.json({ error: "Game ID is required" }, 400);
    }

    const game = await getCloudGame(gameId, userId);
    if (!game) {
      return c.json({ error: "Game not found" }, 404);
    }

    return c.json({ game });
  } catch (error) {
    console.error("Error fetching cloud game:", error);
    return c.json({ error: "Internal server error" }, 500);
  }
});

/**
 * クラウドゲーム作成
 */
export const createCloudGameHandler = factory.createHandlers(
  zValidator("json", createGameSchema),
  async (c) => {
    try {
      const userId = c.req.header("x-user-id");
      if (!userId) {
        return c.json({ error: "Unauthorized" }, 401);
      }

      const gameData = c.req.valid("json");
      const gameId = await createCloudGame(gameData, userId);

      return c.json({ gameId }, 201);
    } catch (error) {
      console.error("Error creating cloud game:", error);
      return c.json({ error: "Internal server error" }, 500);
    }
  }
);

/**
 * クラウドゲーム更新
 */
export const updateCloudGameHandler = factory.createHandlers(
  zValidator("json", updateGameSchema),
  async (c) => {
    try {
      const gameId = c.req.param("gameId");
      const userId = c.req.header("x-user-id");

      if (!userId) {
        return c.json({ error: "Unauthorized" }, 401);
      }

      if (!gameId) {
        return c.json({ error: "Game ID is required" }, 400);
      }

      const gameData = c.req.valid("json");
      await updateCloudGame(gameId, gameData, userId);

      return c.json({ success: true });
    } catch (error) {
      console.error("Error updating cloud game:", error);
      return c.json({ error: "Internal server error" }, 500);
    }
  }
);

/**
 * クラウドゲーム削除
 */
export const deleteCloudGameHandler = factory.createHandlers(async (c) => {
  try {
    const gameId = c.req.param("gameId");
    const userId = c.req.header("x-user-id");

    if (!userId) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    if (!gameId) {
      return c.json({ error: "Game ID is required" }, 400);
    }

    await deleteCloudGame(gameId, userId);

    return c.json({ success: true });
  } catch (error) {
    console.error("Error deleting cloud game:", error);
    return c.json({ error: "Internal server error" }, 500);
  }
});

/**
 * クラウドゲームプレイヤー取得
 */
export const getCloudGamePlayersHandler = factory.createHandlers(async (c) => {
  try {
    const gameId = c.req.param("gameId");
    const userId = c.req.header("x-user-id");

    if (!userId) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    if (!gameId) {
      return c.json({ error: "Game ID is required" }, 400);
    }

    const players = await getCloudGamePlayers(gameId, userId);
    return c.json({ players });
  } catch (error) {
    console.error("Error fetching cloud game players:", error);
    return c.json({ error: "Internal server error" }, 500);
  }
});

/**
 * クラウドゲームプレイヤー追加
 */
export const addCloudGamePlayerHandler = factory.createHandlers(
  zValidator("json", addPlayerSchema),
  async (c) => {
    try {
      const gameId = c.req.param("gameId");
      const userId = c.req.header("x-user-id");

      if (!userId) {
        return c.json({ error: "Unauthorized" }, 401);
      }

      if (!gameId) {
        return c.json({ error: "Game ID is required" }, 400);
      }

      const playerData = c.req.valid("json");
      await addCloudGamePlayer(gameId, playerData, userId);

      return c.json({ success: true }, 201);
    } catch (error) {
      console.error("Error adding cloud game player:", error);
      return c.json({ error: "Internal server error" }, 500);
    }
  }
);

/**
 * クラウドゲームログ取得
 */
export const getCloudGameLogsHandler = factory.createHandlers(async (c) => {
  try {
    const gameId = c.req.param("gameId");
    const userId = c.req.header("x-user-id");

    if (!userId) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    if (!gameId) {
      return c.json({ error: "Game ID is required" }, 400);
    }

    const logs = await getCloudGameLogs(gameId, userId);
    return c.json({ logs });
  } catch (error) {
    console.error("Error fetching cloud game logs:", error);
    return c.json({ error: "Internal server error" }, 500);
  }
});

/**
 * クラウドゲームログ追加
 */
export const addCloudGameLogHandler = factory.createHandlers(
  zValidator("json", addLogSchema),
  async (c) => {
    try {
      const userId = c.req.header("x-user-id");

      if (!userId) {
        return c.json({ error: "Unauthorized" }, 401);
      }

      const logData = c.req.valid("json");
      const logId = await addCloudGameLog(logData, userId);

      return c.json({ logId }, 201);
    } catch (error) {
      console.error("Error adding cloud game log:", error);
      return c.json({ error: "Internal server error" }, 500);
    }
  }
);

/**
 * クラウドゲームログ削除
 */
export const removeCloudGameLogHandler = factory.createHandlers(async (c) => {
  try {
    const logId = c.req.param("logId");
    const userId = c.req.header("x-user-id");

    if (!userId) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    if (!logId) {
      return c.json({ error: "Log ID is required" }, 400);
    }

    await removeCloudGameLog(logId, userId);

    return c.json({ success: true });
  } catch (error) {
    console.error("Error removing cloud game log:", error);
    return c.json({ error: "Internal server error" }, 500);
  }
});
