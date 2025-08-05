import { Hono } from "hono";

import indexHandler from "./controllers";
import deleteGameHandler from "./controllers/game/delete-game";
import deleteLogHandler from "./controllers/game/delete-log";
import getGameDetailHandler from "./controllers/game/get-detail";
import getGameListHandler from "./controllers/game/get-list";
import getGameLogsHandler from "./controllers/game/get-logs";
import getGamePlayersHandler from "./controllers/game/get-players";
import patchGameUpdateHandler from "./controllers/game/patch-update";
import postAddLogHandler from "./controllers/game/post-add-log";
import postAddPlayerHandler from "./controllers/game/post-add-player";
import postCreateGameHandler from "./controllers/game/post-create";
import postLogCountsHandler from "./controllers/game/post-log-counts";
import postPlayerCountsHandler from "./controllers/game/post-player-counts";
import getPlayerListHandler from "./controllers/player/get-list";
import postCreatePlayerHandler from "./controllers/player/post-create";
import getUserPreferencesHandler from "./controllers/user/get-preferences";
import updateUserPreferencesHandler from "./controllers/user/update-preferences";

import { auth } from "@/utils/auth/auth";

// Hono RPCで型をつけるため、チェインさせる必要がある
const app = new Hono()
  .get("/", ...indexHandler)
  .get("/user/:user_id/preferences", ...getUserPreferencesHandler)
  .patch("/user/:user_id/preferences", ...updateUserPreferencesHandler)
  // Games API
  .get("/games", ...getGameListHandler)
  .post("/games", ...postCreateGameHandler)
  .get("/games/:gameId", ...getGameDetailHandler)
  .patch("/games/:gameId", ...patchGameUpdateHandler)
  .delete("/games/:gameId", ...deleteGameHandler)
  .get("/games/:gameId/players", ...getGamePlayersHandler)
  .post("/games/:gameId/players", ...postAddPlayerHandler)
  .get("/games/:gameId/logs", ...getGameLogsHandler)
  .post("/games/logs", ...postAddLogHandler)
  .delete("/games/logs/:logId", ...deleteLogHandler)
  .post("/games/log-counts", ...postLogCountsHandler)
  .post("/games/player-counts", ...postPlayerCountsHandler)
  // Players API
  .get("/players", ...getPlayerListHandler)
  .post("/players", ...postCreatePlayerHandler)
  // Auth
  .post("/auth/*", (c) => {
    return auth.handler(c.req.raw);
  })
  .get("/auth/*", (c) => {
    return auth.handler(c.req.raw);
  });

export default app;

export type APIRouteType = typeof app;
