import { test as setup } from "@playwright/test";

const authFile = "tests/temp/auth/user.json";

/**
 * メール認証ベースのE2Eテスト認証セットアップ
 */
setup("メール認証テストセットアップ", async ({ page }) => {
  const testEmail = `e2e-test@example.com`;
  const testPassword = "test123456";

  await page.request.post("/api/e2e/test-login", {
    headers: {
      "Content-Type": "application/json",
    },
    data: JSON.stringify({
      email: testEmail,
      password: testPassword,
    }),
  });

  const loginResponse = await page.request.post("/api/auth/sign-in/email", {
    headers: {
      "Content-Type": "application/json",
    },
    data: JSON.stringify({
      email: testEmail,
      password: testPassword,
    }),
  });

  if (!loginResponse.ok()) {
    throw new Error(`ログインに失敗しました: ${loginResponse.status()}`);
  }

  await page.context().storageState({ path: authFile });
});
