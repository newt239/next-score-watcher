import { zValidator } from "@hono/zod-validator";
import { createFactory } from "hono/factory";

import {
  CreateGameSchema,
  UpdateGameSchema,
  AddPlayerSchema,
  AddLogSchema,
  GameCountsSchema,
} from "@/models/games";
import {
  getGames,
  getGame,
  createGame,
  updateGame,
  deleteGame,
  getGamePlayers,
  addGamePlayer,
  getGameLogs,
  addGameLog,
  removeGameLog,
  getGamesLogCounts,
  getGamesPlayerCounts,
} from "@/server/repositories/games";

const factory = createFactory();

/**
 * クラウドゲーム一覧取得
 */
export const getGamesHandler = factory.createHandlers(async (c) => {
  try {
    const userId = c.req.header("x-user-id");
    if (!userId) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    const games = await getGames(userId);
    return c.json({ games });
  } catch (error) {
    console.error("Error fetching cloud games:", error);
    return c.json({ error: "Internal server error" }, 500);
  }
});

/**
 * クラウドゲーム詳細取得
 */
export const getGameHandler = factory.createHandlers(async (c) => {
  try {
    const gameId = c.req.param("gameId");
    const userId = c.req.header("x-user-id");

    if (!userId) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    if (!gameId) {
      return c.json({ error: "Game ID is required" }, 400);
    }

    const game = await getGame(gameId, userId);
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
export const createGameHandler = factory.createHandlers(
  zValidator("json", CreateGameSchema),
  async (c) => {
    try {
      const userId = c.req.header("x-user-id");
      if (!userId) {
        return c.json({ error: "Unauthorized" }, 401);
      }

      const gameData = c.req.valid("json");
      const gameId = await createGame(gameData, userId);

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
export const updateGameHandler = factory.createHandlers(
  zValidator("json", UpdateGameSchema),
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
      await updateGame(gameId, gameData, userId);

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
export const deleteGameHandler = factory.createHandlers(async (c) => {
  try {
    const gameId = c.req.param("gameId");
    const userId = c.req.header("x-user-id");

    if (!userId) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    if (!gameId) {
      return c.json({ error: "Game ID is required" }, 400);
    }

    await deleteGame(gameId, userId);

    return c.json({ success: true });
  } catch (error) {
    console.error("Error deleting cloud game:", error);
    return c.json({ error: "Internal server error" }, 500);
  }
});

/**
 * クラウドゲームプレイヤー取得
 */
export const getGamePlayersHandler = factory.createHandlers(async (c) => {
  try {
    const gameId = c.req.param("gameId");
    const userId = c.req.header("x-user-id");

    if (!userId) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    if (!gameId) {
      return c.json({ error: "Game ID is required" }, 400);
    }

    const players = await getGamePlayers(gameId, userId);
    return c.json({ players });
  } catch (error) {
    console.error("Error fetching cloud game players:", error);
    return c.json({ error: "Internal server error" }, 500);
  }
});

/**
 * クラウドゲームプレイヤー追加
 */
export const addGamePlayerHandler = factory.createHandlers(
  zValidator("json", AddPlayerSchema),
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
      await addGamePlayer(gameId, playerData, userId);

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
export const getGameLogsHandler = factory.createHandlers(async (c) => {
  try {
    const gameId = c.req.param("gameId");
    const userId = c.req.header("x-user-id");

    if (!userId) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    if (!gameId) {
      return c.json({ error: "Game ID is required" }, 400);
    }

    const logs = await getGameLogs(gameId, userId);
    return c.json({ logs });
  } catch (error) {
    console.error("Error fetching cloud game logs:", error);
    return c.json({ error: "Internal server error" }, 500);
  }
});

/**
 * クラウドゲームログ追加
 */
export const addGameLogHandler = factory.createHandlers(
  zValidator("json", AddLogSchema),
  async (c) => {
    try {
      const userId = c.req.header("x-user-id");

      if (!userId) {
        return c.json({ error: "Unauthorized" }, 401);
      }

      const logData = c.req.valid("json");
      const logId = await addGameLog(logData, userId);

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
export const removeGameLogHandler = factory.createHandlers(async (c) => {
  try {
    const logId = c.req.param("logId");
    const userId = c.req.header("x-user-id");

    if (!userId) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    if (!logId) {
      return c.json({ error: "Log ID is required" }, 400);
    }

    await removeGameLog(logId, userId);

    return c.json({ success: true });
  } catch (error) {
    console.error("Error removing cloud game log:", error);
    return c.json({ error: "Internal server error" }, 500);
  }
});

/**
 * 複数ゲームのログ数取得
 */
export const getGamesLogCountsHandler = factory.createHandlers(
  zValidator("json", GameCountsSchema),
  async (c) => {
    try {
      const userId = c.req.header("x-user-id");
      if (!userId) {
        return c.json({ error: "Unauthorized" }, 401);
      }

      const { gameIds } = c.req.valid("json");
      const logCounts = await getGamesLogCounts(gameIds, userId);

      return c.json({ logCounts });
    } catch (error) {
      console.error("Error fetching cloud games log counts:", error);
      return c.json({ error: "Internal server error" }, 500);
    }
  }
);

/**
 * 複数ゲームのプレイヤー数取得
 */
export const getGamesPlayerCountsHandler = factory.createHandlers(
  zValidator("json", GameCountsSchema),
  async (c) => {
    try {
      const userId = c.req.header("x-user-id");
      if (!userId) {
        return c.json({ error: "Unauthorized" }, 401);
      }

      const { gameIds } = c.req.valid("json");
      const playerCounts = await getGamesPlayerCounts(gameIds, userId);

      return c.json({ playerCounts });
    } catch (error) {
      console.error("Error fetching cloud games player counts:", error);
      return c.json({ error: "Internal server error" }, 500);
    }
  }
);
