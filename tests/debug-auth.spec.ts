import { expect, test } from "@playwright/test";

import {
  cleanupTestSession,
  createSessionInDatabase,
  generateSessionData,
  setAuthenticationState,
} from "./test-helpers";

test.describe("認証デバッグ", () => {
  let sessionData: {
    sessionId: string;
    sessionToken: string;
    userId: string;
    expiresAt: Date;
  };

  test.beforeEach(async ({ context, page }) => {
    // テスト用セッションデータを生成
    sessionData = generateSessionData();

    // データベースにセッションを作成
    await createSessionInDatabase(sessionData);

    // ブラウザに認証状態を設定
    await setAuthenticationState(context, sessionData.sessionToken);

    // ページを開く前にローカルストレージを設定
    await page.addInitScript(() => {
      window.localStorage.setItem("scorewatcher-version", "latest");
    });
  });

  test.afterEach(async () => {
    // テスト後にセッションをクリーンアップ
    await cleanupTestSession(sessionData.sessionId);
  });

  test("ホームページアクセスと認証状態確認", async ({ page }) => {
    await page.goto("/");

    // スクリーンショットを撮影
    await page.screenshot({ path: "debug-homepage.png", fullPage: true });

    // ページタイトルを確認
    console.log("Page title:", await page.title());

    // 現在のURLを確認
    console.log("Current URL:", page.url());

    // 作成したゲームのリンクがあるか確認
    const gamesLink = page.getByRole("link", { name: "作成したゲーム" });
    const isGamesLinkVisible = await gamesLink
      .isVisible({ timeout: 5000 })
      .catch(() => false);
    console.log("作成したゲームリンクが表示されているか:", isGamesLinkVisible);

    // その他のオンライン関連リンクも確認
    const playersLink = page.getByRole("link", { name: "プレイヤー管理" });
    const isPlayersLinkVisible = await playersLink
      .isVisible({ timeout: 2000 })
      .catch(() => false);
    console.log(
      "プレイヤー管理リンクが表示されているか:",
      isPlayersLinkVisible
    );

    const rulesLink = page.getByRole("link", { name: "形式一覧" });
    const isRulesLinkVisible = await rulesLink
      .isVisible({ timeout: 2000 })
      .catch(() => false);
    console.log("形式一覧リンクが表示されているか:", isRulesLinkVisible);

    if (isGamesLinkVisible) {
      console.log("認証は成功しています");
    } else {
      console.log("認証に問題があるか、オンライン機能のリンクが見つかりません");

      // すべてのリンクを列挙
      const allLinks = await page.locator("a").allTextContents();
      console.log("ページ内の全リンクテキスト:", allLinks.slice(0, 10));
    }

    // サインインページにリダイレクトされていないか確認
    const isNotSignInPage = !page.url().includes("/sign-in");
    console.log("サインインページではない:", isNotSignInPage);

    expect(isNotSignInPage).toBe(true);
  });

  test("直接オンラインゲーム管理ページにアクセス", async ({ page }) => {
    // 直接オンラインゲーム管理ページに移動
    await page.goto("/online/games");

    // スクリーンショットを撮影
    await page.screenshot({ path: "debug-online-games.png", fullPage: true });

    // ページタイトルを確認
    console.log("Online games page title:", await page.title());

    // 現在のURLを確認
    console.log("Current URL:", page.url());

    // 認証が成功していることを確認（サインインページにリダイレクトされない）
    expect(page.url()).not.toContain("/sign-in");

    // "作成"ボタンがあるか確認
    const createButton = page.getByRole("button", { name: "作成" });
    const isCreateButtonVisible = await createButton
      .isVisible({ timeout: 5000 })
      .catch(() => false);
    console.log("作成ボタンが表示されているか:", isCreateButtonVisible);
  });
});
