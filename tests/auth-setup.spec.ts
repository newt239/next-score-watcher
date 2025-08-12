import crypto from "node:crypto";

import { expect, test as setup } from "@playwright/test";

const authFile = "tests/temp/auth/user.json";

/**
 * 認証セットアップ
 * Google OAuth を経由せずに直接セッションを作成してテスト用の認証状態を設定
 */
setup("authenticate", async ({ page }) => {
  // テスト用のユーザーデータ
  const testUserId = process.env.PLAYWRIGHT_TEST_USER_ID;
  const testUserEmail = "test@example.com";
  const testUserName = "テストユーザー";

  // セッションIDとトークンを生成
  const sessionToken = crypto.randomBytes(32).toString("hex");

  // Better Authのセッション形式に合わせてCookieを設定
  await page.context().addCookies([
    {
      name: "better-auth.session_token",
      value: sessionToken,
      domain: "localhost",
      path: "/",
      httpOnly: true,
      secure: false,
      sameSite: "Lax",
    },
  ]);

  // ローカルストレージにユーザー情報を設定（必要に応じて）
  await page.addInitScript(
    (userData) => {
      window.localStorage.setItem("test-user", JSON.stringify(userData));
    },
    {
      id: testUserId,
      email: testUserEmail,
      name: testUserName,
    }
  );

  // ホームページにアクセスして認証状態を確認
  await page.goto("/");

  // 認証が成功していることを確認（サインインページにリダイレクトされない）
  await expect(page).not.toHaveURL("/sign-in");

  // 認証状態をストレージに保存
  await page.context().storageState({ path: authFile });
});
