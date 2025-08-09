import type { Context } from "hono";

/**
 * API Routes用の認証ヘルパー関数
 * クライアント側でユーザーIDをヘッダーに設定する方式
 */

/**
 * リクエストヘッダーからユーザーIDを取得
 */
export const getUserIdFromHeader = (c: Context): string | null => {
  return c.req.header("x-user-id") || null;
};

/**
 * 認証が必要なエンドポイント用のヘルパー
 * 認証されていない場合は401エラーレスポンスを返す
 */
export const requireAuth = (c: Context) => {
  const userId = getUserIdFromHeader(c);

  if (!userId) {
    return c.json(
      {
        success: false,
        error: "認証が必要です",
      } as const,
      401
    );
  }

  return { userId };
};

/**
 * ユーザーIDを安全に取得
 * 認証チェック済みの前提で使用
 */
export const getAuthenticatedUserId = (c: Context): string => {
  const userId = getUserIdFromHeader(c);
  if (!userId) {
    throw new Error("認証されたユーザーIDの取得に失敗しました");
  }
  return userId;
};
