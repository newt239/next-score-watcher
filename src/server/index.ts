import { Hono } from "hono";
import { cors } from "hono/cors";

import indexHandler from "./controllers";
import deleteTestUserHandler from "./controllers/e2e/delete-test-user";
import postTestLoginHandler from "./controllers/e2e/post-test-login";
import deleteGameHandler from "./controllers/game/delete-game";
import deleteLogHandler from "./controllers/game/delete-log";
import deletePlayersHandler from "./controllers/game/delete-players";
import getGameDetailHandler from "./controllers/game/get-detail";
import getGameListHandler from "./controllers/game/get-list";
import getGameLogsHandler from "./controllers/game/get-logs";
import getGamePlayersHandler from "./controllers/game/get-players";
import patchGameUpdateHandler from "./controllers/game/patch-update";
import patchGameUpdateOptionsHandler from "./controllers/game/patch-update-options";
import patchGameUpdatePlayerHandler from "./controllers/game/patch-update-player";
import patchGameUpdatePlayersHandler from "./controllers/game/patch-update-players";
import postAddLogHandler from "./controllers/game/post-add-log";
import postAddPlayerHandler from "./controllers/game/post-add-player";
import postCopyPlayersHandler from "./controllers/game/post-copy-players";
import postCreateGameHandler from "./controllers/game/post-create";
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
import getViewerBoardDataHandler from "./controllers/viewer/get-board-data";
// テスト用認証エンドポイント

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
  .get("/games/:gameId", ...getGameDetailHandler)
  .patch("/games/:gameId", ...patchGameUpdateHandler)
  .patch("/games/:gameId/options", ...patchGameUpdateOptionsHandler)
  .delete("/games/:gameId", ...deleteGameHandler)
  .get("/games/:gameId/players", ...getGamePlayersHandler)
  .post("/games/:gameId/players", ...postAddPlayerHandler)
  .patch("/games/:gameId/players", ...patchGameUpdatePlayersHandler)
  .delete("/games/:gameId/players", ...deletePlayersHandler)
  .patch("/games/players/:gamePlayerId", ...patchGameUpdatePlayerHandler)
  .post("/games/:game_id/copy-players", ...postCopyPlayersHandler)
  .get("/games/:gameId/logs", ...getGameLogsHandler)
  .post("/games/logs", ...postAddLogHandler)
  .delete("/games/logs/:logId", ...deleteLogHandler)
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
  // Viewer API (認証不要)
  .get("/viewer/games/:gameId/board", ...getViewerBoardDataHandler)
  // テスト用認証
  .post("/e2e/test-login", ...postTestLoginHandler)
  .delete("/e2e/test-user", ...deleteTestUserHandler)
  // Auth
  .post("/auth/*", (c) => {
    return auth.handler(c.req.raw);
  })
  .get("/auth/*", (c) => {
    return auth.handler(c.req.raw);
  });

export default app;

export type APIRouteType = typeof app;
