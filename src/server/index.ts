import { Hono } from "hono";

import { indexHandler } from "./controllers";
import { getUserPreferencesHandler } from "./controllers/get-user-preferences";
import { updateUserPreferencesHandler } from "./controllers/update-user-preferences";

import { auth } from "@/utils/auth/auth";

// Hono RPCで型をつけるため、チェインさせる必要がある
const app = new Hono()
  .get("/", ...indexHandler)
  .get("/user/:user_id/preferences", ...getUserPreferencesHandler)
  .patch("/user/:user_id/preferences", ...updateUserPreferencesHandler)
  .post("/auth/*", (c) => {
    return auth.handler(c.req.raw);
  })
  .get("/auth/*", (c) => {
    return auth.handler(c.req.raw);
  });

export default app;

export type APIRouteType = typeof app;
