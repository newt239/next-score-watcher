import { expect, test } from "@playwright/test";

test("認証バイパス機能の基本テスト", async ({ page }) => {
  // テスト用ヘッダーを設定
  await page.setExtraHTTPHeaders({
    "x-test-user-id": "test-user-playwright",
    "x-playwright-test": "true",
  });

  // ホームページアクセス
  await page.goto("/");

  console.log("ホームページURL:", page.url());

  // オンライン機能のリンクが表示されているか確認
  const gamesLink = page.getByRole("link", { name: "作成したゲーム" });
  const isVisible = await gamesLink.isVisible().catch(() => false);

  console.log("作成したゲームリンクが表示されているか:", isVisible);
  expect(isVisible).toBe(true);

  // オンラインゲーム管理ページに直接アクセス
  await page.goto("/online/games");

  console.log("オンラインゲーム管理ページURL:", page.url());

  // サインインページにリダイレクトされていないか確認
  const isNotSignIn = !page.url().includes("/sign-in");
  console.log("サインインページではない:", isNotSignIn);

  if (!isNotSignIn) {
    // デバッグ用にスクリーンショットを撮影
    await page.screenshot({ path: "auth-bypass-failure.png", fullPage: true });
  }

  expect(isNotSignIn).toBe(true);
});
