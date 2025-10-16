import { Hono } from "hono";
import { handle } from "hono/vercel";

import app from "@/server";
import { type AuthType } from "@/utils/auth/auth";

const hono = new Hono<{ Bindings: AuthType }>({
  strict: false,
}).basePath("/api");

hono.route("/", app);

export const GET = handle(hono);
export const POST = handle(hono);
export const PUT = handle(hono);
export const PATCH = handle(hono);
export const DELETE = handle(hono);
