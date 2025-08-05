"use server";

import { headers } from "next/headers";

import { hc } from "hono/client";

import type { APIRouteType } from "@/server";

/**
 * サーバーサイドで使用するAPIクライアント
 * @param headers - リクエストヘッダー
 * @returns APIクライアント
 */
export const createApiClientOnServer = async () => {
  // サーバーサイドでのベースURL決定
  const headersList = await headers();
  const host = headersList.get("host") || "localhost:3000";
  const protocol = process.env.NODE_ENV === "production" ? "https" : "http";
  const baseUrl = `${protocol}://${host}`;

  return hc<APIRouteType>(`${baseUrl}/api`, {
    init: {
      credentials: "include",
      headers: Object.fromEntries(headersList.entries()),
    },
  });
};
