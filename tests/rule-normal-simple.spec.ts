import { expect, test } from "@playwright/test";

/**
 * Normal形式のe2eテスト（簡潔版）
 * 特徴:
 * - 最もシンプルな形式
 * - 正解でポイント増加のみ
 * - 失格・勝ち抜け条件なし
 */
test.describe("Normal形式のテスト", () => {
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
      if (cardContent?.includes("Normal") && !cardContent?.includes("N○M✕")) {
        await button.click();
        break;
      }
    }

    const modal = page.getByRole("dialog");
    await expect(modal).toBeVisible();
    await page.getByLabel("ゲーム名").fill("Normal初期状態テスト");
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
        .getByRole("checkbox", { name: `テストプレイヤー${i}` })
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
    await expect(page.getByText(/No\.\d+/)).toBeVisible();
    await expect(page.getByText("テストプレイヤー１")).toBeVisible();
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
      if (cardContent?.includes("Normal") && !cardContent?.includes("N○M✕")) {
        await button.click();
        break;
      }
    }

    const modal = page.getByRole("dialog");
    await expect(modal).toBeVisible();
    await page.getByLabel("ゲーム名").fill("Normalスコア加算テスト");
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
        .getByRole("checkbox", { name: `テストプレイヤー${i}` })
        .first();
      await playerCheckbox.check();
    }

    await page.keyboard.press("Escape");
    await page.waitForTimeout(2000);

    await page.getByRole("link", { name: "ゲーム開始" }).click();
    await page.waitForTimeout(2000);

    await expect(page).toHaveURL(/\/online\/games\/.*\/board/);
    await page.waitForLoadState("networkidle");

    const players = [
      page.locator("#players-area").nth(0),
      page.locator("#players-area").nth(1),
      page.locator("#players-area").nth(2),
    ];

    // 基本スコア加算テスト
    const firstPlayerButton = players[0].getByRole("button").first();

    // 初期スコア確認
    await expect(firstPlayerButton).toContainText("0pt");

    // スコア加算確認
    await firstPlayerButton.click();
    await page.waitForTimeout(500);
    await expect(firstPlayerButton).toContainText("1pt");

    await firstPlayerButton.click();
    await page.waitForTimeout(500);
    await expect(firstPlayerButton).toContainText("2pt");

    // 複数プレイヤーのスコア操作
    // プレイヤー2: 3回正解
    for (let i = 0; i < 3; i++) {
      await players[1].getByRole("button").first().click();
      await page.waitForTimeout(200);
    }
    await expect(players[1]).toContainText("3pt");

    // プレイヤー3: 1回正解
    await players[2].getByRole("button").first().click();
    await page.waitForTimeout(200);
    await expect(players[2]).toContainText("1pt");
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
      if (cardContent?.includes("Normal") && !cardContent?.includes("N○M✕")) {
        await button.click();
        break;
      }
    }

    const modal = page.getByRole("dialog");
    await expect(modal).toBeVisible();
    await page.getByLabel("ゲーム名").fill("Normal特徴確認テスト");
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
        .getByRole("checkbox", { name: `テストプレイヤー${i}` })
        .first();
      await playerCheckbox.check();
    }

    await page.keyboard.press("Escape");
    await page.waitForTimeout(2000);

    await page.getByRole("link", { name: "ゲーム開始" }).click();
    await page.waitForTimeout(2000);

    await expect(page).toHaveURL(/\/online\/games\/.*\/board/);
    await page.waitForLoadState("networkidle");

    const players = [
      page.locator("#players-area").nth(0),
      page.locator("#players-area").nth(1),
      page.locator("#players-area").nth(2),
    ];

    // 誤答ボタンが存在しないことを確認
    const firstPlayerButtons = players[0].getByRole("button");
    const playerButtonCount = await firstPlayerButtons.count();
    expect(playerButtonCount).toBe(1);

    // 全員がplaying状態を維持
    for (let i = 0; i < 3; i++) {
      await expect(players[i].getByRole("button").first()).not.toBeDisabled();
      await expect(players[i]).not.toHaveClass(/win/);
      await expect(players[i]).not.toHaveClass(/lose/);
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
      if (cardContent?.includes("Normal") && !cardContent?.includes("N○M✕")) {
        await button.click();
        break;
      }
    }

    const modal = page.getByRole("dialog");
    await expect(modal).toBeVisible();
    await page.getByLabel("ゲーム名").fill("Normal機能テスト");
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
        .getByRole("checkbox", { name: `テストプレイヤー${i}` })
        .first();
      await playerCheckbox.check();
    }

    await page.keyboard.press("Escape");
    await page.waitForTimeout(2000);

    await page.getByRole("link", { name: "ゲーム開始" }).click();
    await page.waitForTimeout(2000);

    await expect(page).toHaveURL(/\/online\/games\/.*\/board/);
    await page.waitForLoadState("networkidle");

    // スルー機能テスト
    const questionBefore = await page
      .locator("[data-testid='question-number']")
      .textContent();
    await page.getByRole("button", { name: "スルー" }).click();
    await page.waitForTimeout(500);
    const questionAfter = await page
      .locator("[data-testid='question-number']")
      .textContent();
    expect(questionAfter).not.toBe(questionBefore);

    // Undo機能テスト
    await page.getByRole("button", { name: "一つ戻す" }).click();
    await page.waitForTimeout(500);
    const questionAfterUndo = await page
      .locator("[data-testid='question-number']")
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
      if (cardContent?.includes("Normal") && !cardContent?.includes("N○M✕")) {
        await button.click();
        break;
      }
    }

    const modal = page.getByRole("dialog");
    await expect(modal).toBeVisible();
    await page.getByLabel("ゲーム名").fill("Normalキーボードテスト");
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
        .getByRole("checkbox", { name: `テストプレイヤー${i}` })
        .first();
      await playerCheckbox.check();
    }

    await page.keyboard.press("Escape");
    await page.waitForTimeout(2000);

    await page.getByRole("link", { name: "ゲーム開始" }).click();
    await page.waitForTimeout(2000);

    await expect(page).toHaveURL(/\/online\/games\/.*\/board/);
    await page.waitForLoadState("networkidle");

    const players = [
      page.locator("#players-area").nth(0),
      page.locator("#players-area").nth(1),
      page.locator("#players-area").nth(2),
    ];

    // 初期状態設定（プレイヤー1を2pt、プレイヤー2を3ptにする）
    await players[0].getByRole("button").first().click();
    await page.waitForTimeout(200);
    await players[0].getByRole("button").first().click();
    await page.waitForTimeout(200);

    for (let i = 0; i < 3; i++) {
      await players[1].getByRole("button").first().click();
      await page.waitForTimeout(200);
    }

    // キーボードショートカットテスト
    await page.keyboard.press("1");
    await page.waitForTimeout(500);
    await expect(players[0]).toContainText("3pt");

    await page.keyboard.press("2");
    await page.waitForTimeout(500);
    await expect(players[1]).toContainText("4pt");

    await page.keyboard.press(",");
    await page.waitForTimeout(500);
    await expect(players[1]).toContainText("3pt");
  });
});
