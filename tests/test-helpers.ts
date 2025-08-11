import crypto from "node:crypto";

import type { BrowserContext } from "@playwright/test";

/**
 * テスト用の認証ヘルパー関数
 */

/**
 * テスト用ユーザーデータ
 */
export const TEST_USER = {
  id: "test-user-playwright",
  email: "playwright-test@example.com",
  name: "Playwrightテストユーザー",
  image: null,
  emailVerified: false,
  createdAt: new Date(),
  updatedAt: new Date(),
};

/**
 * Better Auth形式のセッション情報を生成
 */
export function generateSessionData() {
  return {
    sessionId: crypto.randomBytes(32).toString("hex"),
    sessionToken: crypto.randomBytes(32).toString("hex"),
    userId: TEST_USER.id,
    expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7日後
  };
}

/**
 * ブラウザコンテキストに認証状態を設定
 */
export async function setAuthenticationState(
  context: BrowserContext,
  _sessionToken: string
) {
  // テスト用ヘッダーを設定してサーバーサイド認証をバイパス
  await context.setExtraHTTPHeaders({
    "x-test-user-id": "test-user-playwright",
  });

  console.log(
    "Set test authentication header: x-test-user-id = test-user-playwright"
  );
}

/**
 * APIリクエストでセッションを作成（実際のDBに挿入）
 */
export async function createSessionInDatabase(sessionData: {
  sessionId: string;
  sessionToken: string;
  userId: string;
  expiresAt: Date;
}) {
  // HonoのAPIエンドポイントを使用してセッションを作成
  const response = await fetch(
    "http://localhost:3000/api/test/create-session",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        ...sessionData,
        user: TEST_USER,
      }),
    }
  );

  if (!response.ok) {
    throw new Error(`Failed to create test session: ${response.statusText}`);
  }

  return response.json();
}

/**
 * テスト終了後にセッションをクリーンアップ
 */
export async function cleanupTestSession(sessionId: string) {
  try {
    await fetch(`http://localhost:3000/api/test/cleanup-session/${sessionId}`, {
      method: "DELETE",
    });
  } catch (error) {
    console.warn("Failed to cleanup test session:", error);
  }
}
