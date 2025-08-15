import { expect, test } from "@playwright/test";

test.describe("オンライン版得点表示", () => {
  test.beforeEach(async ({ context, page }) => {
    // ヘッダーベースの認証バイパスを設定
    await context.setExtraHTTPHeaders({
      "x-test-user-id": "test-user-playwright",
      "x-playwright-test": "true",
    });

    // ページを開く前にローカルストレージを設定
    await page.addInitScript(() => {
      window.localStorage.setItem("scorewatcher-version", "latest");
    });

    await page.goto("/");

    // 認証が成功していることを確認
    await expect(page).not.toHaveURL("/sign-in");
  });

  test("オンラインゲーム一覧ページにアクセスできる", async ({ page }) => {
    // オンラインゲーム管理ページに直接移動
    await page.goto("/online/games");
    await expect(page).toHaveURL(/\/online\/games/);
    await expect(page).toHaveTitle(/ゲーム一覧/);
  });

  test("オンラインゲームを作成できる", async ({ page }) => {
    // オンラインゲーム管理ページに移動
    await page.goto("/online/games");

    // 新しいゲームを作成リンクをクリック
    await page.getByRole("link", { name: "新しいゲームを作成" }).click();

    // 形式一覧ページに移動
    await expect(page).toHaveURL("/online/rules");

    // 通常形式の「作る」ボタンをクリック
    await page.getByRole("button", { name: "作る" }).first().click();

    // ゲーム作成モーダルが表示される
    const modal = page.getByRole("dialog");
    await expect(modal).toBeVisible();

    // ゲーム名を入力
    const testGameName = "Playwrightテストゲーム";
    await page.getByLabel("ゲーム名").fill(testGameName);

    // 作成ボタンをクリック (モーダル内の作るボタンを確実にクリック)
    await page
      .locator('[role="dialog"]')
      .getByRole("button", { name: "作る" })
      .click();

    // 作成後、設定ページにリダイレクトされる
    await expect(page).toHaveURL(/\/online\/games\/.*\/config/);
    await expect(page).toHaveTitle(/ゲーム設定/);

    // ページが正しく表示される（設定ページのタイトル確認で十分）
    await expect(page.getByText("スコア計算")).toBeVisible();
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

      // 成功メッセージを閉じる
      const alert = page.getByRole("alert");
      if (await alert.isVisible()) {
        await alert.getByRole("button").first().click();
      }
    }
  });

  test("ボードページでスコア表示とプレイヤー操作ができる", async ({ page }) => {
    // テスト用ゲームとプレイヤーをセットアップ
    await page.goto("/online/games");

    // 既存のゲームがある場合はそれを使用、なければ新規作成
    const existingGame = page.getByTitle("ゲーム").first();

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
    await expect(page).toHaveTitle(/クラウド得点表示/);

    // 問題番号が表示される
    const questionHeader = page.getByRole("banner").locator("span").first();
    await expect(questionHeader).toContainText("Q1");
  });

  test("ボードページでプレイヤーのスコア操作ができる", async ({ page }) => {
    // ボードページに直接移動（実際のゲームIDが必要）
    // まずは設定済みのゲームを探す
    await page.goto("/online/games");

    // 最初のゲームのボードページに移動
    const firstGame = page.locator('[data-testid="game-card"]').first();
    if ((await firstGame.count()) === 0) {
      // ゲームが存在しない場合は新規作成
      await page.getByRole("link", { name: "新しいゲームを作成" }).click();
      await page.getByRole("button", { name: "作る" }).first().click();
      await page.getByLabel("ゲーム名").fill("スコアテストゲーム");
      await page
        .locator('[role="dialog"]')
        .getByRole("button", { name: "作る" })
        .click();

      // ゲーム開始
      await page.getByRole("link", { name: "ゲーム開始" }).click();
    } else {
      // 既存ゲームでボード開始
      await firstGame.getByRole("link", { name: "ボード表示" }).click();
    }

    // プレイヤーエリアが存在することを確認
    const playersArea = page.locator("#players-area");
    await expect(playersArea).toBeVisible();

    // プレイヤーがいる場合の操作テスト
    const firstPlayer = playersArea.locator("div").first();
    if ((await firstPlayer.count()) > 0) {
      // プレイヤー名が表示される
      const playerName = firstPlayer.getByTestId("player-name");
      await expect(playerName).toBeVisible();

      // スコアボタンが表示される
      const scoreButton = firstPlayer.getByRole("button");
      await expect(scoreButton).toBeVisible();

      // 初期スコアが0ptであることを確認
      await expect(scoreButton).toContainText("0pt");

      // スコアボタンをクリックして正解
      await scoreButton.click();

      // スコアが1ptに更新される
      await expect(scoreButton).toContainText("1pt");

      // ログテーブルに操作が記録される
      const logTable = page.locator("table");
      const firstLogRow = logTable.locator("tr").first();
      await expect(firstLogRow.locator("td").nth(2)).toContainText("o");

      // 問題番号が進む
      await expect(
        page.getByRole("banner").locator("span").first()
      ).toContainText("Q2");
    }
  });

  test("スルー操作ができる", async ({ page }) => {
    // ボードページに移動（前のテストと同様の手順）
    await page.goto("/online/games");

    const firstGame = page.locator('[data-testid="game-card"]').first();
    if ((await firstGame.count()) === 0) {
      // 新規ゲーム作成
      await page.getByRole("link", { name: "新しいゲームを作成" }).click();
      await page.getByRole("button", { name: "作る" }).first().click();
      await page.getByLabel("ゲーム名").fill("スルーテストゲーム");
      await page
        .locator('[role="dialog"]')
        .getByRole("button", { name: "作る" })
        .click();
      await page.getByRole("link", { name: "ゲーム開始" }).click();
    } else {
      await firstGame.getByRole("link", { name: "ボード表示" }).click();
    }

    // 現在の問題番号を記録
    const currentQuestion = await page
      .getByRole("banner")
      .locator("span")
      .first()
      .textContent();
    const questionNumber = parseInt(
      currentQuestion?.match(/Q(\d+)/)?.[1] || "1"
    );

    // スルーボタンをクリック
    const throughButton = page.getByRole("button", { name: "スルー" });
    if (await throughButton.isVisible()) {
      await throughButton.click();
    } else {
      // モバイル表示の場合はメニューからスルーを選択
      await page.getByRole("banner").getByRole("button").click();
      await page.getByRole("menuitem", { name: "スルー" }).click();
    }

    // 問題番号が進む
    await expect(
      page.getByRole("banner").locator("span").first()
    ).toContainText(`Q${questionNumber + 1}`);

    // ログテーブルにスルー操作が記録される
    const logTable = page.locator("table");
    const firstLogRow = logTable.locator("tr").first();
    await expect(firstLogRow.locator("td").nth(1)).toContainText("(スルー)");
    await expect(firstLogRow.locator("td").nth(2)).toContainText("-");
  });

  test("Undo操作ができる", async ({ page }) => {
    // ボードページに移動
    await page.goto("/online/games");

    const firstGame = page.locator('[data-testid="game-card"]').first();
    if ((await firstGame.count()) === 0) {
      // 新規ゲーム作成とプレイヤー操作
      await page.getByRole("link", { name: "新しいゲームを作成" }).click();
      await page.getByRole("button", { name: "作る" }).first().click();
      await page.getByLabel("ゲーム名").fill("Undoテストゲーム");
      await page
        .locator('[role="dialog"]')
        .getByRole("button", { name: "作る" })
        .click();
      await page.getByRole("link", { name: "ゲーム開始" }).click();
    } else {
      await firstGame.getByRole("link", { name: "ボード表示" }).click();
    }

    // プレイヤーがいる場合は操作を実行
    const playersArea = page.locator("#players-area");
    const firstPlayer = playersArea.locator("div").first();

    if ((await firstPlayer.count()) > 0) {
      // 正解操作を実行
      const scoreButton = firstPlayer.getByRole("button");
      await scoreButton.click();

      // Q2になることを確認
      await expect(
        page.getByRole("banner").locator("span").first()
      ).toContainText("Q2");

      // Undoボタンをクリック
      const undoButton = page.getByRole("button", { name: "一つ戻す" });
      if (await undoButton.isVisible()) {
        await undoButton.click();
      } else {
        // モバイル表示の場合
        await page.getByRole("banner").getByRole("button").click();
        await page.getByRole("menuitem", { name: "一つ戻す" }).click();
      }

      // Q1に戻る
      await expect(
        page.getByRole("banner").locator("span").first()
      ).toContainText("Q1");

      // スコアが0ptに戻る
      await expect(scoreButton).toContainText("0pt");
    }
  });
});
