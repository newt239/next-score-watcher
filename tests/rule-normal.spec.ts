import { expect, test } from "@playwright/test";

/**
 * Normal形式のe2e
 * 特徴:
 * - 最もシンプルな形式
 * - 正解でポイント増加のみ
 * - 失格・勝ち抜け条件なし
 */
test.describe("Normal形式", () => {
  test.beforeEach(async ({ page }) => {
    await page.addInitScript(() => {
      window.localStorage.setItem("scorewatcher-version", "latest");
    });
  });

  test("ゲーム作成と初期状態確認", async ({ page }) => {
    // ゲーム作成
    await page.goto("/online/rules");
    await page.waitForLoadState("networkidle");

    const createButtons = page.getByRole("button", { name: "作る" });
    const createButtonCount = await createButtons.count();

    for (let i = 0; i < createButtonCount; i++) {
      const button = createButtons.nth(i);
      const cardContent = await button
        .locator("..")
        .locator("..")
        .textContent();
      if (cardContent?.includes("スコア計算")) {
        await button.click();
        break;
      }
    }

    const modal = page.getByRole("dialog");
    await expect(modal).toBeVisible();
    await page.getByLabel("ゲーム名").fill("Normal初期状態");
    await page.waitForTimeout(500);

    await page
      .locator('[role="dialog"]')
      .getByRole("button", { name: "作る" })
      .click();

    await expect(page).toHaveURL(/\/online\/games\/.*\/config/);
    await page.waitForLoadState("networkidle");

    await page.getByRole("tab", { name: "プレイヤー設定" }).click();
    await page.waitForLoadState("networkidle");

    await page.getByRole("button", { name: "プレイヤーを選択" }).click();
    await page.waitForTimeout(1000);

    const dialog = page.getByRole("dialog", { name: "プレイヤー選択" });
    await expect(dialog).toBeVisible();

    for (let i = 1; i <= 3; i++) {
      const playerCheckbox = page
        .getByRole("table")
        .getByRole("checkbox", { name: `プレイヤー${i}`, exact: true })
        .first();
      await playerCheckbox.check();
    }

    await page.keyboard.press("Escape");
    await page.waitForTimeout(2000);

    await page.getByRole("link", { name: "ゲーム開始" }).click();
    await page.waitForTimeout(2000);

    await expect(page).toHaveURL(/\/online\/games\/.*\/board/);
    await page.waitForLoadState("networkidle");

    // 初期状態の確認
    await expect(page.getByText(/No\.\d+/).first()).toBeVisible();
    await expect(page.getByText("プレイヤー１", { exact: true })).toBeVisible();
  });

  test("基本スコア加算機能", async ({ page }) => {
    // ゲーム作成（共通処理）
    await page.goto("/online/rules");
    await page.waitForLoadState("networkidle");

    const createButtons = page.getByRole("button", { name: "作る" });
    const createButtonCount = await createButtons.count();

    for (let i = 0; i < createButtonCount; i++) {
      const button = createButtons.nth(i);
      const cardContent = await button
        .locator("..")
        .locator("..")
        .textContent();
      if (cardContent?.includes("スコア計算")) {
        await button.click();
        break;
      }
    }

    const modal = page.getByRole("dialog");
    await expect(modal).toBeVisible();
    await page.getByLabel("ゲーム名").fill("Normalスコア加算");
    await page.waitForTimeout(500);

    await page
      .locator('[role="dialog"]')
      .getByRole("button", { name: "作る" })
      .click();

    await expect(page).toHaveURL(/\/online\/games\/.*\/config/);
    await page.waitForLoadState("networkidle");

    await page.getByRole("tab", { name: "プレイヤー設定" }).click();
    await page.waitForLoadState("networkidle");

    await page.getByRole("button", { name: "プレイヤーを選択" }).click();
    await page.waitForTimeout(1000);

    const dialog = page.getByRole("dialog", { name: "プレイヤー選択" });
    await expect(dialog).toBeVisible();

    for (let i = 1; i <= 3; i++) {
      const playerCheckbox = page
        .getByRole("table")
        .getByRole("checkbox", { name: `プレイヤー${i}`, exact: true })
        .first();
      await playerCheckbox.check();
    }

    await page.keyboard.press("Escape");
    await page.waitForTimeout(2000);

    await page.getByRole("link", { name: "ゲーム開始" }).click();
    await page.waitForTimeout(2000);

    await expect(page).toHaveURL(/\/online\/games\/.*\/board/);
    await page.waitForLoadState("networkidle");

    // プレイヤーのスコアボタンを見つける
    const firstPlayerButton = page
      .getByRole("button")
      .filter({ hasText: "0pt" })
      .first();

    // 初期スコア確認
    await expect(firstPlayerButton).toContainText("0pt");

    // スコア加算確認
    await firstPlayerButton.click();
    await page.waitForTimeout(1000);

    // 更新されたボタンを再取得
    const updatedButton1 = page
      .getByRole("button")
      .filter({ hasText: "1pt" })
      .first();
    await expect(updatedButton1).toContainText("1pt");

    await updatedButton1.click();
    await page.waitForTimeout(1000);

    // さらに更新されたボタンを再取得
    const updatedButton2 = page
      .getByRole("button")
      .filter({ hasText: "2pt" })
      .first();
    await expect(updatedButton2).toContainText("2pt");

    // 複数プレイヤーのスコア操作
    // プレイヤー2: 初期状態のボタンを取得（2番目の0ptボタン）
    const allInitialButtons = page
      .getByRole("button")
      .filter({ hasText: "0pt" });
    const secondPlayerButton = allInitialButtons.nth(1);

    // プレイヤー2: 3回正解
    await secondPlayerButton.click();
    await page.waitForTimeout(500);
    let player2Button = page
      .getByRole("button")
      .filter({ hasText: "1pt" })
      .nth(0);

    await player2Button.click();
    await page.waitForTimeout(500);
    player2Button = page.getByRole("button").filter({ hasText: "2pt" }).nth(0);

    await player2Button.click();
    await page.waitForTimeout(500);
    player2Button = page.getByRole("button").filter({ hasText: "3pt" }).nth(0);
    await expect(player2Button).toContainText("3pt");

    // プレイヤー3: 1回正解（3番目の0ptボタン）
    const thirdPlayerButton = allInitialButtons.nth(2);
    await thirdPlayerButton.click();
    await page.waitForTimeout(500);
    const player3Button = page
      .getByRole("button")
      .filter({ hasText: "1pt" })
      .nth(0);
    await expect(player3Button).toContainText("1pt");
  });

  test("Normal形式の特徴確認", async ({ page }) => {
    // ゲーム作成（共通処理）
    await page.goto("/online/rules");
    await page.waitForLoadState("networkidle");

    const createButtons = page.getByRole("button", { name: "作る" });
    const createButtonCount = await createButtons.count();

    for (let i = 0; i < createButtonCount; i++) {
      const button = createButtons.nth(i);
      const cardContent = await button
        .locator("..")
        .locator("..")
        .textContent();
      if (cardContent?.includes("スコア計算")) {
        await button.click();
        break;
      }
    }

    const modal = page.getByRole("dialog");
    await expect(modal).toBeVisible();
    await page.getByLabel("ゲーム名").fill("Normal特徴確認");
    await page.waitForTimeout(500);

    await page
      .locator('[role="dialog"]')
      .getByRole("button", { name: "作る" })
      .click();

    await expect(page).toHaveURL(/\/online\/games\/.*\/config/);
    await page.waitForLoadState("networkidle");

    await page.getByRole("tab", { name: "プレイヤー設定" }).click();
    await page.waitForLoadState("networkidle");

    await page.getByRole("button", { name: "プレイヤーを選択" }).click();
    await page.waitForTimeout(1000);

    const dialog = page.getByRole("dialog", { name: "プレイヤー選択" });
    await expect(dialog).toBeVisible();

    for (let i = 1; i <= 3; i++) {
      const playerCheckbox = page
        .getByRole("table")
        .getByRole("checkbox", { name: `プレイヤー${i}`, exact: true })
        .first();
      await playerCheckbox.check();
    }

    await page.keyboard.press("Escape");
    await page.waitForTimeout(2000);

    await page.getByRole("link", { name: "ゲーム開始" }).click();
    await page.waitForTimeout(2000);

    await expect(page).toHaveURL(/\/online\/games\/.*\/board/);
    await page.waitForLoadState("networkidle");

    // Normalルールの特徴確認（正解ボタンのみ、誤答なし）
    const firstPlayerArea = page
      .getByText("プレイヤー１", { exact: true })
      .locator("..");
    const firstPlayerButtons = firstPlayerArea.getByRole("button");
    const playerButtonCount = await firstPlayerButtons.count();
    expect(playerButtonCount).toBeGreaterThanOrEqual(1);

    // 全員がplaying状態を維持（ボタンがアクティブ）
    const playerNames = ["プレイヤー１", "プレイヤー２", "プレイヤー３"];
    for (const playerName of playerNames) {
      const playerButton = page
        .getByText(playerName, { exact: true })
        .locator("..")
        .getByRole("button")
        .first();
      await expect(playerButton).not.toBeDisabled();
    }
  });

  test("スルー機能とUndo機能", async ({ page }) => {
    // ゲーム作成（共通処理）
    await page.goto("/online/rules");
    await page.waitForLoadState("networkidle");

    const createButtons = page.getByRole("button", { name: "作る" });
    const createButtonCount = await createButtons.count();

    for (let i = 0; i < createButtonCount; i++) {
      const button = createButtons.nth(i);
      const cardContent = await button
        .locator("..")
        .locator("..")
        .textContent();
      if (cardContent?.includes("スコア計算")) {
        await button.click();
        break;
      }
    }

    const modal = page.getByRole("dialog");
    await expect(modal).toBeVisible();
    await page.getByLabel("ゲーム名").fill("Normal機能");
    await page.waitForTimeout(500);

    await page
      .locator('[role="dialog"]')
      .getByRole("button", { name: "作る" })
      .click();

    await expect(page).toHaveURL(/\/online\/games\/.*\/config/);
    await page.waitForLoadState("networkidle");

    await page.getByRole("tab", { name: "プレイヤー設定" }).click();
    await page.waitForLoadState("networkidle");

    await page.getByRole("button", { name: "プレイヤーを選択" }).click();
    await page.waitForTimeout(1000);

    const dialog = page.getByRole("dialog", { name: "プレイヤー選択" });
    await expect(dialog).toBeVisible();

    for (let i = 1; i <= 3; i++) {
      const playerCheckbox = page
        .getByRole("table")
        .getByRole("checkbox", { name: `プレイヤー${i}`, exact: true })
        .first();
      await playerCheckbox.check();
    }

    await page.keyboard.press("Escape");
    await page.waitForTimeout(2000);

    await page.getByRole("link", { name: "ゲーム開始" }).click();
    await page.waitForTimeout(2000);

    await expect(page).toHaveURL(/\/online\/games\/.*\/board/);
    await page.waitForLoadState("networkidle");

    // スルー機能
    const questionBefore = await page
      .getByText(/No\.\d+/)
      .first()
      .textContent();
    await page.getByRole("button", { name: "スルー" }).click();
    await page.waitForTimeout(500);
    const questionAfter = await page
      .getByText(/No\.\d+/)
      .first()
      .textContent();
    expect(questionAfter).not.toBe(questionBefore);

    // Undo機能
    await page.getByRole("button", { name: "一つ戻す" }).click();
    await page.waitForTimeout(500);
    const questionAfterUndo = await page
      .getByText(/No\.\d+/)
      .first()
      .textContent();
    expect(questionAfterUndo).toBe(questionBefore);
  });

  test("キーボードショートカット", async ({ page }) => {
    // ゲーム作成（共通処理）
    await page.goto("/online/rules");
    await page.waitForLoadState("networkidle");

    const createButtons = page.getByRole("button", { name: "作る" });
    const createButtonCount = await createButtons.count();

    for (let i = 0; i < createButtonCount; i++) {
      const button = createButtons.nth(i);
      const cardContent = await button
        .locator("..")
        .locator("..")
        .textContent();
      if (cardContent?.includes("スコア計算")) {
        await button.click();
        break;
      }
    }

    const modal = page.getByRole("dialog");
    await expect(modal).toBeVisible();
    await page.getByLabel("ゲーム名").fill("Normalキーボード");
    await page.waitForTimeout(500);

    await page
      .locator('[role="dialog"]')
      .getByRole("button", { name: "作る" })
      .click();

    await expect(page).toHaveURL(/\/online\/games\/.*\/config/);
    await page.waitForLoadState("networkidle");

    await page.getByRole("tab", { name: "プレイヤー設定" }).click();
    await page.waitForLoadState("networkidle");

    await page.getByRole("button", { name: "プレイヤーを選択" }).click();
    await page.waitForTimeout(1000);

    const dialog = page.getByRole("dialog", { name: "プレイヤー選択" });
    await expect(dialog).toBeVisible();

    for (let i = 1; i <= 3; i++) {
      const playerCheckbox = page
        .getByRole("table")
        .getByRole("checkbox", { name: `プレイヤー${i}`, exact: true })
        .first();
      await playerCheckbox.check();
    }

    await page.keyboard.press("Escape");
    await page.waitForTimeout(2000);

    await page.getByRole("link", { name: "ゲーム開始" }).click();
    await page.waitForTimeout(2000);

    await expect(page).toHaveURL(/\/online\/games\/.*\/board/);
    await page.waitForLoadState("networkidle");

    // プレイヤーボタンを取得
    const firstPlayerButton = page
      .getByText("プレイヤー１", { exact: true })
      .locator("..")
      .getByRole("button")
      .first();
    const secondPlayerButton = page
      .getByText("プレイヤー２", { exact: true })
      .locator("..")
      .getByRole("button")
      .first();

    // 初期状態設定（プレイヤー1を2pt、プレイヤー2を3ptにする）
    await firstPlayerButton.click();
    await page.waitForTimeout(200);
    await firstPlayerButton.click();
    await page.waitForTimeout(200);

    for (let i = 0; i < 3; i++) {
      await secondPlayerButton.click();
      await page.waitForTimeout(200);
    }

    // キーボードショートカット
    await page.keyboard.press("1");
    await page.waitForTimeout(500);
    await expect(firstPlayerButton).toContainText("3pt");

    await page.keyboard.press("2");
    await page.waitForTimeout(500);
    await expect(secondPlayerButton).toContainText("4pt");

    await page.keyboard.press(",");
    await page.waitForTimeout(500);
    await expect(secondPlayerButton).toContainText("3pt");
  });
});
