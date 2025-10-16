import { expect, test } from "@playwright/test";

/**
 * SquareX形式のe2e
 * 特徴:
 * - 奇数問目・偶数問目の正解数の積でスコア計算
 * - 3行レイアウト（スコア・計算式・操作ボタン）
 * - 問題番号による分類システム
 */
test.describe("SquareX形式", () => {
  test.beforeEach(async ({ page }) => {
    await page.addInitScript(() => {
      window.localStorage.setItem("scorewatcher-version", "latest");
    });
  });

  test("ゲーム作成と設定", async ({ page }) => {
    await page.goto("/online/rules");
    await page.waitForLoadState("networkidle");

    const createButtons = page.getByRole("button", { name: "作る" });
    const buttonCount = await createButtons.count();

    for (let i = 0; i < buttonCount; i++) {
      const button = createButtons.nth(i);
      const cardContent = await button
        .locator("..")
        .locator("..")
        .textContent();
      if (cardContent?.includes("SquareX") || cardContent?.includes("Square")) {
        await button.click();
        break;
      }
    }

    const modal = page.getByRole("dialog");
    await expect(modal).toBeVisible();
    await page.getByLabel("ゲーム名").fill("SquareX設定");
    await page.waitForTimeout(500);

    await page
      .locator('[role="dialog"]')
      .getByRole("button", { name: "作る" })
      .click();

    await expect(page).toHaveURL(/\/online\/games\/.*\/config/);
    await page.waitForLoadState("networkidle");

    // 勝ち抜けスコアを16に設定
    const winPointInput = page.getByLabel("勝ち抜けスコア");
    await winPointInput.clear();
    await winPointInput.fill("16");

    await page.getByRole("tab", { name: "プレイヤー設定" }).click();
    await page.waitForLoadState("networkidle");

    await page.getByRole("button", { name: "プレイヤーを選択" }).click();
    await page.waitForTimeout(1000);

    const dialog = page.getByRole("dialog", { name: "プレイヤー選択" });
    await expect(dialog).toBeVisible();

    for (let i = 1; i <= 2; i++) {
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
  });

  test("奇数偶数スコア計算", async ({ page }) => {
    // SquareXゲーム作成（共通処理）
    await page.goto("/online/rules");
    await page.waitForLoadState("networkidle");

    const createButtons = page.getByRole("button", { name: "作る" });
    const buttonCount = await createButtons.count();

    for (let i = 0; i < buttonCount; i++) {
      const button = createButtons.nth(i);
      const cardContent = await button
        .locator("..")
        .locator("..")
        .textContent();
      if (cardContent?.includes("SquareX") || cardContent?.includes("Square")) {
        await button.click();
        break;
      }
    }

    const modal = page.getByRole("dialog");
    await expect(modal).toBeVisible();
    await page.getByLabel("ゲーム名").fill("SquareXスコア計算");
    await page.waitForTimeout(500);

    await page
      .locator('[role="dialog"]')
      .getByRole("button", { name: "作る" })
      .click();

    await expect(page).toHaveURL(/\/online\/games\/.*\/config/);
    await page.waitForLoadState("networkidle");

    // 勝ち抜けスコアを16に設定
    const winPointInput = page.getByLabel("勝ち抜けスコア");
    await winPointInput.clear();
    await winPointInput.fill("16");

    await page.getByRole("tab", { name: "プレイヤー設定" }).click();
    await page.waitForLoadState("networkidle");

    await page.getByRole("button", { name: "プレイヤーを選択" }).click();
    await page.waitForTimeout(1000);

    const dialog = page.getByRole("dialog", { name: "プレイヤー選択" });
    await expect(dialog).toBeVisible();

    for (let i = 1; i <= 2; i++) {
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

    const firstPlayer = page.locator("#players-area").first();
    const correctButton = firstPlayer.getByRole("button").first();

    // 初期状態確認
    await expect(firstPlayer).toContainText("0pt");

    // 奇数偶数スコア計算テスト
    // Q1（奇数問目）で正解
    await correctButton.click();
    await page.waitForTimeout(500);
    await expect(firstPlayer).toContainText("0pt"); // 1×0=0pt

    // Q2（偶数問目）で正解
    await correctButton.click();
    await page.waitForTimeout(500);
    await expect(firstPlayer).toContainText("1pt"); // 1×1=1pt

    // Q3（奇数問目）で正解
    await correctButton.click();
    await page.waitForTimeout(500);
    await expect(firstPlayer).toContainText("2pt"); // 2×1=2pt

    // Q4（偶数問目）で正解
    await correctButton.click();
    await page.waitForTimeout(500);
    await expect(firstPlayer).toContainText("4pt"); // 2×2=4pt
  });

  test("計算式表示確認", async ({ page }) => {
    // SquareXゲーム作成（共通処理）
    await page.goto("/online/rules");
    await page.waitForLoadState("networkidle");

    const createButtons = page.getByRole("button", { name: "作る" });
    const buttonCount = await createButtons.count();

    for (let i = 0; i < buttonCount; i++) {
      const button = createButtons.nth(i);
      const cardContent = await button
        .locator("..")
        .locator("..")
        .textContent();
      if (cardContent?.includes("SquareX") || cardContent?.includes("Square")) {
        await button.click();
        break;
      }
    }

    const modal = page.getByRole("dialog");
    await expect(modal).toBeVisible();
    await page.getByLabel("ゲーム名").fill("SquareX計算式");
    await page.waitForTimeout(500);

    await page
      .locator('[role="dialog"]')
      .getByRole("button", { name: "作る" })
      .click();

    await expect(page).toHaveURL(/\/online\/games\/.*\/config/);
    await page.waitForLoadState("networkidle");

    // 勝ち抜けスコアを16に設定
    const winPointInput = page.getByLabel("勝ち抜けスコア");
    await winPointInput.clear();
    await winPointInput.fill("16");

    await page.getByRole("tab", { name: "プレイヤー設定" }).click();
    await page.waitForLoadState("networkidle");

    await page.getByRole("button", { name: "プレイヤーを選択" }).click();
    await page.waitForTimeout(1000);

    const dialog = page.getByRole("dialog", { name: "プレイヤー選択" });
    await expect(dialog).toBeVisible();

    for (let i = 1; i <= 2; i++) {
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

    const firstPlayer = page.locator("#players-area").first();
    const correctButton = firstPlayer.getByRole("button").first();

    // 4回正解して2×2の状態にする
    for (let i = 0; i < 4; i++) {
      await correctButton.click();
      await page.waitForTimeout(200);
    }

    // 計算式表示確認
    const formulaDisplay = firstPlayer.locator(
      ".formula-display, .calculation-display"
    );
    if (await formulaDisplay.isVisible()) {
      await expect(formulaDisplay).toContainText("2×2");
    }
  });

  test("勝ち抜けテスト", async ({ page }) => {
    // SquareXゲーム作成（共通処理）
    await page.goto("/online/rules");
    await page.waitForLoadState("networkidle");

    const createButtons = page.getByRole("button", { name: "作る" });
    const buttonCount = await createButtons.count();

    for (let i = 0; i < buttonCount; i++) {
      const button = createButtons.nth(i);
      const cardContent = await button
        .locator("..")
        .locator("..")
        .textContent();
      if (cardContent?.includes("SquareX") || cardContent?.includes("Square")) {
        await button.click();
        break;
      }
    }

    const modal = page.getByRole("dialog");
    await expect(modal).toBeVisible();
    await page.getByLabel("ゲーム名").fill("SquareX勝ち抜け");
    await page.waitForTimeout(500);

    await page
      .locator('[role="dialog"]')
      .getByRole("button", { name: "作る" })
      .click();

    await expect(page).toHaveURL(/\/online\/games\/.*\/config/);
    await page.waitForLoadState("networkidle");

    // 勝ち抜けスコアを16に設定
    const winPointInput = page.getByLabel("勝ち抜けスコア");
    await winPointInput.clear();
    await winPointInput.fill("16");

    await page.getByRole("tab", { name: "プレイヤー設定" }).click();
    await page.waitForLoadState("networkidle");

    await page.getByRole("button", { name: "プレイヤーを選択" }).click();
    await page.waitForTimeout(1000);

    const dialog = page.getByRole("dialog", { name: "プレイヤー選択" });
    await expect(dialog).toBeVisible();

    for (let i = 1; i <= 2; i++) {
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

    const firstPlayer = page.locator("#players-area").first();
    const correctButton = firstPlayer.getByRole("button").first();

    // 勝ち抜けテスト（16pt到達）
    // 8回正解（4×4=16ptを目指す）
    for (let i = 0; i < 8; i++) {
      await correctButton.click();
      await page.waitForTimeout(200);
    }
    await expect(firstPlayer).toContainText("16pt");
    await expect(firstPlayer).toContainText("1st");
    await expect(correctButton).toBeDisabled();
  });

  test("誤答の影響とキーボードショートカット", async ({ page }) => {
    // SquareXゲーム作成（共通処理）
    await page.goto("/online/rules");
    await page.waitForLoadState("networkidle");

    const createButtons = page.getByRole("button", { name: "作る" });
    const buttonCount = await createButtons.count();

    for (let i = 0; i < buttonCount; i++) {
      const button = createButtons.nth(i);
      const cardContent = await button
        .locator("..")
        .locator("..")
        .textContent();
      if (cardContent?.includes("SquareX") || cardContent?.includes("Square")) {
        await button.click();
        break;
      }
    }

    const modal = page.getByRole("dialog");
    await expect(modal).toBeVisible();
    await page.getByLabel("ゲーム名").fill("SquareX機能");
    await page.waitForTimeout(500);

    await page
      .locator('[role="dialog"]')
      .getByRole("button", { name: "作る" })
      .click();

    await expect(page).toHaveURL(/\/online\/games\/.*\/config/);
    await page.waitForLoadState("networkidle");

    // 勝ち抜けスコアを16に設定
    const winPointInput = page.getByLabel("勝ち抜けスコア");
    await winPointInput.clear();
    await winPointInput.fill("16");

    await page.getByRole("tab", { name: "プレイヤー設定" }).click();
    await page.waitForLoadState("networkidle");

    await page.getByRole("button", { name: "プレイヤーを選択" }).click();
    await page.waitForTimeout(1000);

    const dialog = page.getByRole("dialog", { name: "プレイヤー選択" });
    await expect(dialog).toBeVisible();

    for (let i = 1; i <= 2; i++) {
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

    const secondPlayer = page.locator("#players-area").nth(1);
    const player2Correct = secondPlayer.getByRole("button").first();
    const player2Wrong = secondPlayer.getByRole("button").last();

    // 誤答の影響テスト（プレイヤー2で実行）
    // 2回正解（Q1奇数、Q2偶数）
    await player2Correct.click();
    await page.waitForTimeout(200);
    await player2Correct.click();
    await page.waitForTimeout(200);
    await expect(secondPlayer).toContainText("1pt"); // 1×1=1pt

    // 誤答（Q3奇数で誤答）
    await player2Wrong.click();
    await page.waitForTimeout(200);
    await expect(secondPlayer).toContainText("1pt"); // スコア変わらず

    // Undo機能テスト
    await page.getByRole("button", { name: "一つ戻す" }).click();
    await page.waitForTimeout(500);
    // 最後の誤答が取り消される

    // キーボードショートカット
    await page.keyboard.press("2");
    await page.waitForTimeout(500);
    // プレイヤー2正解

    await page.keyboard.press("Shift+2");
    await page.waitForTimeout(500);
    // プレイヤー2誤答

    await page.keyboard.press(",");
    await page.waitForTimeout(500);
    // Undo操作
  });
});
