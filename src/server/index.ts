import { Hono } from "hono";

import { auth } from "@/utils/auth/auth";
import { indexHandler } from "./controllers";

// Hono RPCで型をつけるため、チェインさせる必要がある
const app = new Hono()
  .get("/", ...indexHandler)
  .post("/auth/*", (c) => {
    return auth.handler(c.req.raw);
  })
  .get("/auth/*", (c) => {
    return auth.handler(c.req.raw);
  });

export default app;

export type APIRouteType = typeof app;
