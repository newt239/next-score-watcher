import { expect, test as setup } from "@playwright/test";

const authFile = "tests/temp/auth/user.json";

/**
 * メール認証ベースのE2Eテスト認証セットアップ
 */
setup("メール認証テストセットアップ", async ({ page }) => {
  // テスト用認証エンドポイントでログイン
  const response = await page.request.post("/api/auth/test-login", {
    data: {
      email: "e2e-test@example.com",
      password: "test123456",
    },
  });

  if (!response.ok()) {
    throw new Error(`認証に失敗しました: ${response.status()}`);
  }

  const { token } = await response.json();

  // セッショントークンをクッキーに設定
  await page.context().addCookies([
    {
      name: "better-auth.session_token",
      value: token,
      domain: "localhost",
      path: "/",
      httpOnly: true,
      secure: false,
      sameSite: "Lax",
    },
  ]);

  // ホームページにアクセスして認証状態を確認
  await page.goto("/");

  // 認証が成功していることを確認（サインインページにリダイレクトされない）
  await expect(page).not.toHaveURL("/sign-in");

  // 認証状態をストレージに保存
  await page.context().storageState({ path: authFile });
});
