import { Hono } from "hono";

import indexHandler from "./controllers";
import {
  getCloudGamesHandler,
  getCloudGameHandler,
  createCloudGameHandler,
  updateCloudGameHandler,
  deleteCloudGameHandler,
  getCloudGamePlayersHandler,
  addCloudGamePlayerHandler,
  getCloudGameLogsHandler,
  addCloudGameLogHandler,
  removeCloudGameLogHandler,
} from "./controllers/cloud-games";
import getUserPreferencesHandler from "./controllers/get-user-preferences";
import updateUserPreferencesHandler from "./controllers/update-user-preferences";

import { auth } from "@/utils/auth/auth";

// Hono RPCで型をつけるため、チェインさせる必要がある
const app = new Hono()
  .get("/", ...indexHandler)
  .get("/user/:user_id/preferences", ...getUserPreferencesHandler)
  .patch("/user/:user_id/preferences", ...updateUserPreferencesHandler)
  // Cloud Games API
  .get("/cloud-games", ...getCloudGamesHandler)
  .post("/cloud-games", ...createCloudGameHandler)
  .get("/cloud-games/:gameId", ...getCloudGameHandler)
  .patch("/cloud-games/:gameId", ...updateCloudGameHandler)
  .delete("/cloud-games/:gameId", ...deleteCloudGameHandler)
  .get("/cloud-games/:gameId/players", ...getCloudGamePlayersHandler)
  .post("/cloud-games/:gameId/players", ...addCloudGamePlayerHandler)
  .get("/cloud-games/:gameId/logs", ...getCloudGameLogsHandler)
  .post("/cloud-games/logs", ...addCloudGameLogHandler)
  .delete("/cloud-games/logs/:logId", ...removeCloudGameLogHandler)
  // Auth
  .post("/auth/*", (c) => {
    return auth.handler(c.req.raw);
  })
  .get("/auth/*", (c) => {
    return auth.handler(c.req.raw);
  });

export default app;

export type APIRouteType = typeof app;
