import { hc } from "hono/client";

import type { APIRouteType } from "@/server";

import { authClient } from "@/utils/auth/auth-client";

const baseUrl = process.env.NEXT_PUBLIC_VERCEL_BRANCH_URL
  ? `https://${process.env.NEXT_PUBLIC_VERCEL_BRANCH_URL}`
  : "http://localhost:3000";

/**
 * 認証ヘッダー付きAPIクライアントを作成
 * ユーザーがログインしている場合はx-user-idヘッダーを追加
 */
const createApiClient = async () => {
  try {
    const session = await authClient.getSession();
    const userId = session.data?.user?.id;

    return hc<APIRouteType>(`${baseUrl}/api`, {
      init: {
        credentials: "include",
        headers: userId ? { "x-user-id": userId } : {},
      },
    });
  } catch (error) {
    console.error("Failed to create API client:", error);
    // フォールバック: ヘッダーなしのクライアント
    return hc<APIRouteType>(`${baseUrl}/api`, {
      init: {
        credentials: "include",
      },
    });
  }
};

export default createApiClient;
