import { Hono } from "hono";
import { cors } from "hono/cors";

import indexHandler from "./controllers";
import deleteGameHandler from "./controllers/game/delete-game";
import deleteLogHandler from "./controllers/game/delete-log";
import getGameDetailHandler from "./controllers/game/get-detail";
import getGameListHandler from "./controllers/game/get-list";
import getGameLogsHandler from "./controllers/game/get-logs";
import getGamePlayersHandler from "./controllers/game/get-players";
import getGameSettingsHandler from "./controllers/game/get-settings";
import patchGameSettingsHandler from "./controllers/game/patch-settings";
import patchGameUpdateHandler from "./controllers/game/patch-update";
import postAddLogHandler from "./controllers/game/post-add-log";
import postAddPlayerHandler from "./controllers/game/post-add-player";
import postCopyPlayersHandler from "./controllers/game/post-copy-players";
import postCreateGameHandler from "./controllers/game/post-create";
import postLogCountsHandler from "./controllers/game/post-log-counts";
import postPlayerCountsHandler from "./controllers/game/post-player-counts";
import deletePlayerHandler from "./controllers/player/delete-player";
import deletePlayerTagHandler from "./controllers/player/delete-tag";
import getPlayerDetailHandler from "./controllers/player/get-detail";
import getPlayerListHandler from "./controllers/player/get-list";
import patchUpdatePlayerHandler from "./controllers/player/patch-update";
import postAddPlayerTagHandler from "./controllers/player/post-add-tag";
import postCreatePlayerHandler from "./controllers/player/post-create";
import deleteQuizHandler from "./controllers/quiz/delete-quiz";
import getQuizDetailHandler from "./controllers/quiz/get-detail";
import getQuizListHandler from "./controllers/quiz/get-list";
import patchUpdateQuizHandler from "./controllers/quiz/patch-update";
import postCreateQuizHandler from "./controllers/quiz/post-create";
import getUserPreferencesHandler from "./controllers/user/get-preferences";
import updateUserPreferencesHandler from "./controllers/user/update-preferences";

import { auth } from "@/utils/auth/auth";

// Hono RPCで型をつけるため、チェインさせる必要がある
const app = new Hono()
  .use(
    "*",
    cors({
      // https://hono.dev/docs/middleware/builtin/cors
      origin: (origin, _c) => {
        return origin.endsWith("newts-projects.vercel.app") ||
          origin.endsWith("score-watcher.com") ||
          origin.endsWith("localhost:3000")
          ? origin
          : "https://score-watcher.com";
      },
      allowMethods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
      allowHeaders: ["Content-Type", "Authorization"],
      credentials: true,
    })
  )
  .get("/", ...indexHandler)
  .get("/user/:user_id/preferences", ...getUserPreferencesHandler)
  .patch("/user/:user_id/preferences", ...updateUserPreferencesHandler)
  // Games API
  .get("/games", ...getGameListHandler)
  .post("/games", ...postCreateGameHandler)
  .patch("/games", ...patchGameUpdateHandler)
  .delete("/games", ...deleteGameHandler)
  .get("/games/:gameId", ...getGameDetailHandler)
  .get("/games/:gameId/settings", ...getGameSettingsHandler)
  .patch("/games/:gameId/settings", ...patchGameSettingsHandler)
  .get("/games/:gameId/players", ...getGamePlayersHandler)
  .post("/games/:gameId/players", ...postAddPlayerHandler)
  .post("/games/:game_id/copy-players", ...postCopyPlayersHandler)
  .get("/games/:gameId/logs", ...getGameLogsHandler)
  .post("/games/logs", ...postAddLogHandler)
  .delete("/games/logs/:logId", ...deleteLogHandler)
  .post("/games/log-counts", ...postLogCountsHandler)
  .post("/games/player-counts", ...postPlayerCountsHandler)
  // Players API
  .get("/players", ...getPlayerListHandler)
  .post("/players", ...postCreatePlayerHandler)
  .patch("/players", ...patchUpdatePlayerHandler)
  .delete("/players", ...deletePlayerHandler)
  .get("/players/:id", ...getPlayerDetailHandler)
  .post("/players/:id/tags", ...postAddPlayerTagHandler)
  .delete("/players/:id/tags", ...deletePlayerTagHandler)
  // Quizes API
  .get("/quizes", ...getQuizListHandler)
  .post("/quizes", ...postCreateQuizHandler)
  .patch("/quizes", ...patchUpdateQuizHandler)
  .delete("/quizes", ...deleteQuizHandler)
  .get("/quizes/:id", ...getQuizDetailHandler)
  // Auth
  .post("/auth/*", (c) => {
    return auth.handler(c.req.raw);
  })
  .get("/auth/*", (c) => {
    return auth.handler(c.req.raw);
  });

export default app;

export type APIRouteType = typeof app;
