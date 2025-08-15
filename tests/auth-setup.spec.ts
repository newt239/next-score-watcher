import { expect, test as setup } from "@playwright/test";

const authFile = "tests/temp/auth/user.json";

/**
 * メール認証ベースのE2Eテスト認証セットアップ
 */
setup("メール認証テストセットアップ", async ({ page }) => {
  // ユニークなテストユーザーを作成
  const timestamp = Date.now();
  const testEmail = `e2e-test-${timestamp}@example.com`;
  const testPassword = "test123456";

  // Better Authの標準サインアップエンドポイントでアカウント作成
  const signUpResponse = await page.request.post("/api/auth/sign-up/email", {
    data: {
      email: testEmail,
      password: testPassword,
      name: "E2Eテストユーザー",
    },
  });

  // 既存ユーザーの場合は422エラーが返される可能性があるが、それは正常
  if (!signUpResponse.ok() && signUpResponse.status() !== 422) {
    const responseText = await signUpResponse.text();
    console.error("サインアップ失敗:", signUpResponse.status(), responseText);
    throw new Error(`サインアップに失敗しました: ${signUpResponse.status()}`);
  }

  // Better Authの標準ログインエンドポイントでログイン
  const loginResponse = await page.request.post("/api/auth/sign-in/email", {
    data: {
      email: testEmail,
      password: testPassword,
    },
  });

  if (!loginResponse.ok()) {
    const responseText = await loginResponse.text();
    console.error("ログイン失敗:", loginResponse.status(), responseText);
    throw new Error(`ログインに失敗しました: ${loginResponse.status()}`);
  }

  // Set-Cookieヘッダーを確認
  const setCookieHeaders = loginResponse.headers()["set-cookie"];
  console.log("Set-Cookie headers:", setCookieHeaders);

  // ホームページにアクセスして認証状態を確認
  await page.goto("/");

  // 認証が成功していることを確認（サインインページにリダイレクトされない）
  await expect(page).not.toHaveURL("/sign-in");

  // 認証状態をストレージに保存
  await page.context().storageState({ path: authFile });
});
