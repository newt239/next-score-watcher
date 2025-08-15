import { expect, test } from "@playwright/test";

import type { Page } from "@playwright/test";

// テスト用のユーティリティ関数
const createGameIfNeeded = async (page: Page, gameName: string) => {
  await page.goto("/online/games");
  await page.waitForLoadState("networkidle");

  const firstGame = page.locator('[data-testid="game-card"]').first();
  const gameExists = await firstGame.count();

  if (gameExists === 0) {
    // 新規ゲーム作成
    await page.getByRole("link", { name: "新しいゲームを作成" }).click();
    await page.getByRole("button", { name: "作る" }).first().click();
    await page.getByLabel("ゲーム名").fill(gameName);
    await page.waitForTimeout(500);
    await page
      .locator('[role="dialog"]')
      .getByRole("button", { name: "作る" })
      .click();
    await page.waitForLoadState("networkidle");
    return true; // 新規作成した
  }
  return false; // 既存を使用
};

const navigateToBoard = async (page: Page) => {
  const firstGame = page.locator('[data-testid="game-card"]').first();
  await firstGame.getByRole("link", { name: "ボード表示" }).click();
  await page.waitForLoadState("networkidle");
};

test.describe("オンライン版得点表示", () => {
  test.beforeEach(async ({ context, page }) => {
    // テスト用のユーザーID（auth-helpersと一致させる）
    const testUserId = "test-user-playwright";

    // ヘッダーベースの認証バイパスを設定
    await context.setExtraHTTPHeaders({
      "x-test-user-id": testUserId,
      "x-playwright-test": "true",
    });

    // ページを開く前にローカルストレージを設定
    await page.addInitScript(() => {
      window.localStorage.setItem("scorewatcher-version", "latest");
    });

    await page.goto("/");
    await page.waitForLoadState("networkidle");

    // 認証が成功していることを確認
    await expect(page).not.toHaveURL("/sign-in");
  });

  test("オンラインゲーム一覧ページにアクセスできる", async ({ page }) => {
    // オンラインゲーム管理ページに直接移動
    await page.goto("/online/games");
    await expect(page).toHaveURL(/\/online\/games/);
    await page.waitForLoadState("networkidle");

    // ゲーム一覧のヘッダーまたはコンテンツが表示されることを確認
    await expect(page.getByText("ゲーム")).toBeVisible();
  });

  test("オンラインゲームを作成できる", async ({ page }) => {
    // オンラインゲーム管理ページに移動
    await page.goto("/online/games");

    // 新しいゲームを作成リンクをクリック
    await page.getByRole("link", { name: "新しいゲームを作成" }).click();

    // 形式一覧ページに移動
    await expect(page).toHaveURL("/online/rules");
    await page.waitForLoadState("networkidle");

    // 通常形式の「作る」ボタンをクリック
    await page.getByRole("button", { name: "作る" }).first().click();

    // ゲーム作成モーダルが表示される
    const modal = page.getByRole("dialog");
    await expect(modal).toBeVisible();

    // ゲーム名を入力
    const testGameName = "Playwrightテストゲーム";
    await page.getByLabel("ゲーム名").fill(testGameName);
    await page.waitForTimeout(500); // 入力待機

    // 作成ボタンをクリック (モーダル内の作るボタンを確実にクリック)
    await page
      .locator('[role="dialog"]')
      .getByRole("button", { name: "作る" })
      .click();

    // 作成後、設定ページにリダイレクトされる
    await expect(page).toHaveURL(/\/online\/games\/.*\/config/);
    await page.waitForLoadState("networkidle");

    // ページが正しく表示される（設定ページのタイトル確認で十分）
    await expect(page.getByText("プレイヤー設定")).toBeVisible();
  });

  test("プレイヤーを作成してゲームに追加できる", async ({ page }) => {
    // まずゲームを作成
    await page.goto("/online/games");
    await page.getByRole("link", { name: "新しいゲームを作成" }).click();
    await page.getByRole("button", { name: "作る" }).first().click();
    await page.getByLabel("ゲーム名").fill("テストゲーム");
    await page
      .locator('[role="dialog"]')
      .getByRole("button", { name: "作る" })
      .click();

    // ゲーム設定ページでプレイヤータブに移動
    await page.getByRole("tab", { name: "プレイヤー設定" }).click();

    // プレイヤー管理ページに移動
    await page.getByRole("link", { name: "プレイヤーを読み込む" }).click();
    await expect(page).toHaveURL(/\/online\/players/);
    await page.waitForLoadState("networkidle");

    // テスト用プレイヤーを作成
    const testPlayerNames = [
      "テストプレイヤー1",
      "テストプレイヤー2",
      "テストプレイヤー3",
    ];

    for (const playerName of testPlayerNames) {
      await page.getByLabel("氏名").fill(playerName);
      await page.getByRole("button", { name: "追加" }).click();

      // プレイヤーが追加されたことを確認
      await expect(page.getByRole("table")).toContainText(playerName);

      // 成功メッセージを閉じる（存在する場合）
      try {
        const alert = page.getByRole("alert");
        if (await alert.isVisible({ timeout: 2000 })) {
          await alert.getByRole("button").first().click();
        }
      } catch {
        // アラートがない場合は無視
      }
    }
  });

  test("ボードページでスコア表示とプレイヤー操作ができる", async ({ page }) => {
    // テスト用ゲームとプレイヤーをセットアップ
    await page.goto("/online/games");

    // 既存のゲームがある場合はそれを使用、なければ新規作成
    await page.waitForLoadState("networkidle");
    const existingGame = page.locator('[data-testid="game-card"]').first();

    if ((await existingGame.count()) > 0) {
      // 既存ゲームの設定ページに移動
      await existingGame.getByRole("link", { name: "設定" }).click();
    } else {
      // 新規ゲーム作成
      await page.getByRole("link", { name: "新しいゲームを作成" }).click();
      await page.getByRole("button", { name: "作る" }).first().click();
      await page.getByLabel("ゲーム名").fill("ボードテストゲーム");
      await page
        .locator('[role="dialog"]')
        .getByRole("button", { name: "作る" })
        .click();
    }

    // ゲーム開始ボタンでボードページに移動
    await page.getByRole("link", { name: "ゲーム開始" }).click();

    // ボードページが表示される
    await expect(page).toHaveURL(/\/online\/games\/.*\/board/);
    await page.waitForLoadState("networkidle");

    // 問題番号が表示される
    await expect(page.locator("header").getByText(/Q\d+/)).toBeVisible();
  });

  test("ボードページでプレイヤーのスコア操作ができる", async ({ page }) => {
    // ゲームを作成または既存を使用
    const isNewGame = await createGameIfNeeded(page, "スコアテストゲーム");

    if (isNewGame) {
      // 新規作成の場合はゲーム開始ページに移動
      await page.getByRole("link", { name: "ゲーム開始" }).click();
      await page.waitForLoadState("networkidle");
    } else {
      // 既存ゲームの場合はボードページに移動
      await navigateToBoard(page);
    }

    // プレイヤーエリアが存在することを確認
    const playersArea = page
      .locator(".Players_players__area, [data-testid='players-area'], main")
      .first();
    await expect(playersArea).toBeVisible();

    // プレイヤーがいる場合の操作テスト
    const playerCards = playersArea.locator(
      '.Player_player, [data-testid="player"]'
    );
    const playerCount = await playerCards.count();

    if (playerCount > 0) {
      const firstPlayer = playerCards.first();

      // スコアボタンが表示される（通常形式の場合は1つのボタン）
      const scoreButton = firstPlayer.getByRole("button").first();
      await expect(scoreButton).toBeVisible();

      // 初期スコアが0ptであることを確認
      await expect(scoreButton).toContainText("0pt");

      // スコアボタンをクリックして正解
      await scoreButton.click();
      await page.waitForTimeout(1000);

      // スコアが1ptに更新される
      await expect(scoreButton).toContainText("1pt");

      // 問題番号が進む
      await expect(page.locator("header").getByText(/Q\d+/)).toContainText(
        "Q2"
      );
    }
  });

  test("スルー操作ができる", async ({ page }) => {
    // ゲームを作成または既存を使用
    const isNewGame = await createGameIfNeeded(page, "スルーテストゲーム");

    if (isNewGame) {
      await page.getByRole("link", { name: "ゲーム開始" }).click();
      await page.waitForLoadState("networkidle");
    } else {
      await navigateToBoard(page);
    }

    // 現在の問題番号を記録
    const currentQuestionElement = page.locator("header").getByText(/Q\d+/);
    const currentQuestion = await currentQuestionElement.textContent();
    const questionNumber = parseInt(
      currentQuestion?.match(/Q(\d+)/)?.[1] || "1"
    );

    // スルーボタンをクリック（メニューからアクセス）
    await page.locator("header").getByRole("button").click();
    await page.getByRole("menuitem", { name: "スルー" }).click();
    await page.waitForTimeout(1000);

    // 問題番号が進む
    await expect(page.locator("header").getByText(/Q\d+/)).toContainText(
      `Q${questionNumber + 1}`
    );
  });

  test("Undo操作ができる", async ({ page }) => {
    // ゲームを作成または既存を使用
    const isNewGame = await createGameIfNeeded(page, "Undoテストゲーム");

    if (isNewGame) {
      await page.getByRole("link", { name: "ゲーム開始" }).click();
      await page.waitForLoadState("networkidle");
    } else {
      await navigateToBoard(page);
    }

    // プレイヤーがいる場合は操作を実行
    const playersArea = page
      .locator(".Players_players__area, [data-testid='players-area'], main")
      .first();
    const playerCards = playersArea.locator(
      '.Player_player, [data-testid="player"]'
    );
    const playerCount = await playerCards.count();

    if (playerCount > 0) {
      const firstPlayer = playerCards.first();
      // 正解操作を実行
      const scoreButton = firstPlayer.getByRole("button").first();
      await scoreButton.click();
      await page.waitForTimeout(1000);

      // Q2になることを確認
      await expect(page.locator("header").getByText(/Q\d+/)).toContainText(
        "Q2"
      );

      // Undoボタンをクリック（メニューからアクセス）
      await page.locator("header").getByRole("button").click();
      await page.getByRole("menuitem", { name: "一つ戻す" }).click();
      await page.waitForTimeout(1000);

      // Q1に戻る
      await expect(page.locator("header").getByText(/Q\d+/)).toContainText(
        "Q1"
      );

      // スコアが0ptに戻る
      await expect(scoreButton).toContainText("0pt");
    }
  });
});
