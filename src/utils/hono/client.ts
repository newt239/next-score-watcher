import { hc } from "hono/client";

import type { APIRouteType } from "@/server";

const baseUrl = process.env.NEXT_PUBLIC_VERCEL_BRANCH_URL
  ? `https://${process.env.NEXT_PUBLIC_VERCEL_BRANCH_URL}`
  : "http://localhost:3000";

/**
 * ブラウザ上で動作するAPIクライアントを作成
 */
const createApiClient = async () => {
  return hc<APIRouteType>(`${baseUrl}/api`, {
    init: {
      credentials: "include",
    },
  });
};

export default createApiClient;
