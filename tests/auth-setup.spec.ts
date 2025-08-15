import crypto from "node:crypto";

import { expect, test as setup } from "@playwright/test";

const authFile = "tests/temp/auth/user.json";

/**
 * 認証セットアップ
 * Google OAuth を経由せずに直接セッションを作成してテスト用の認証状態を設定
 */
setup("authenticate", async ({ page }) => {
  // テスト用のユーザーデータ
  const testUserId = "test-user-playwright";
  const testUserEmail = "playwright-test@example.com";
  const testUserName = "Playwrightテストユーザー";
  const sessionToken = crypto.randomBytes(32).toString("hex");
  const sessionId = crypto.randomBytes(16).toString("hex");

  // テスト用ユーザーとセッションをデータベースに作成
  const response = await page.request.post(
    "http://localhost:3000/api/test/create-session",
    {
      data: {
        sessionId,
        sessionToken,
        userId: testUserId,
        expiresAt: Date.now() + 7 * 24 * 60 * 60 * 1000, // 7日後
        user: {
          id: testUserId,
          email: testUserEmail,
          name: testUserName,
          image: null,
          emailVerified: 0,
        },
      },
    }
  );

  if (!response.ok()) {
    throw new Error(
      `Failed to create test session: ${response.status()} ${await response.text()}`
    );
  }

  // コンテキストにテスト用ヘッダーを設定
  await page.context().setExtraHTTPHeaders({
    "x-test-user-id": testUserId,
    "x-playwright-test": "true",
  });

  // ホームページにアクセスして認証状態を確認
  await page.goto("/");

  // 認証が成功していることを確認（サインインページにリダイレクトされない）
  await expect(page).not.toHaveURL("/sign-in");

  // 認証状態をストレージに保存
  await page.context().storageState({ path: authFile });
});
