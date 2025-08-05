import { Hono } from "hono";

import indexHandler from "./controllers";
import {
  getGamesHandler,
  getGameHandler,
  createGameHandler,
  updateGameHandler,
  deleteGameHandler,
  getGamePlayersHandler,
  addGamePlayerHandler,
  getGameLogsHandler,
  addGameLogHandler,
  removeGameLogHandler,
  getGamesLogCountsHandler,
  getGamesPlayerCountsHandler,
} from "./controllers/games";
import getUserPreferencesHandler from "./controllers/get-user-preferences";
import { getPlayersHandler, createPlayerHandler } from "./controllers/players";
import updateUserPreferencesHandler from "./controllers/update-user-preferences";

import { auth } from "@/utils/auth/auth";

// Hono RPCで型をつけるため、チェインさせる必要がある
const app = new Hono()
  .get("/", ...indexHandler)
  .get("/user/:user_id/preferences", ...getUserPreferencesHandler)
  .patch("/user/:user_id/preferences", ...updateUserPreferencesHandler)
  // Games API
  .get("/games", ...getGamesHandler)
  .post("/games", ...createGameHandler)
  .get("/games/:gameId", ...getGameHandler)
  .patch("/games/:gameId", ...updateGameHandler)
  .delete("/games/:gameId", ...deleteGameHandler)
  .get("/games/:gameId/players", ...getGamePlayersHandler)
  .post("/games/:gameId/players", ...addGamePlayerHandler)
  .get("/games/:gameId/logs", ...getGameLogsHandler)
  .post("/games/logs", ...addGameLogHandler)
  .delete("/games/logs/:logId", ...removeGameLogHandler)
  .post("/games/log-counts", ...getGamesLogCountsHandler)
  .post("/games/player-counts", ...getGamesPlayerCountsHandler)
  // Players API
  .get("/players", ...getPlayersHandler)
  .post("/players", ...createPlayerHandler)
  // Auth
  .post("/auth/*", (c) => {
    return auth.handler(c.req.raw);
  })
  .get("/auth/*", (c) => {
    return auth.handler(c.req.raw);
  });

export default app;

export type APIRouteType = typeof app;
