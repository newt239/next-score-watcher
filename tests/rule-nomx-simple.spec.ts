import { expect, test } from "@playwright/test";

/**
 * NomX形式（N○M✕）のe2eテスト（簡潔版）
 * 特徴:
 * - N回正解で勝ち抜け
 * - M回誤答で失格
 * - リーチ状態の表示
 */
test.describe("NomX形式のテスト", () => {
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
      if (cardContent?.includes("N○M✕") && !cardContent?.includes("連答つき")) {
        await button.click();
        break;
      }
    }

    const modal = page.getByRole("dialog");
    await expect(modal).toBeVisible();
    await page.getByLabel("ゲーム名").fill("NomX設定テスト");
    await page.waitForTimeout(500);

    await page
      .locator('[role="dialog"]')
      .getByRole("button", { name: "作る" })
      .click();

    await expect(page).toHaveURL(/\/online\/games\/.*\/config/);
    await page.waitForLoadState("networkidle");

    // 5○3✕に設定
    const winPointInput = page.getByLabel("正解数（勝ち抜け）");
    await winPointInput.clear();
    await winPointInput.fill("5");

    const losePointInput = page.getByLabel("誤答数（失格）");
    await losePointInput.clear();
    await losePointInput.fill("3");

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
  });

  test("基本操作（正解・誤答）", async ({ page }) => {
    // ゲーム作成（共通処理）
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
      if (cardContent?.includes("N○M✕") && !cardContent?.includes("連答つき")) {
        await button.click();
        break;
      }
    }

    const modal = page.getByRole("dialog");
    await expect(modal).toBeVisible();
    await page.getByLabel("ゲーム名").fill("NomX基本操作テスト");
    await page.waitForTimeout(500);

    await page
      .locator('[role="dialog"]')
      .getByRole("button", { name: "作る" })
      .click();

    await expect(page).toHaveURL(/\/online\/games\/.*\/config/);
    await page.waitForLoadState("networkidle");

    // 5○3✕に設定
    const winPointInput = page.getByLabel("正解数（勝ち抜け）");
    await winPointInput.clear();
    await winPointInput.fill("5");

    const losePointInput = page.getByLabel("誤答数（失格）");
    await losePointInput.clear();
    await losePointInput.fill("3");

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

    // 基本操作テスト
    const correctButton = players[0].getByRole("button").first();
    const wrongButton = players[0].getByRole("button").last();

    // 正解操作
    await correctButton.click();
    await page.waitForTimeout(300);
    await expect(players[0]).toContainText("1-0");

    // 誤答操作
    await wrongButton.click();
    await page.waitForTimeout(300);
    await expect(players[0]).toContainText("1-1");
  });

  test("リーチ状態テスト", async ({ page }) => {
    // ゲーム作成（共通処理）
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
      if (cardContent?.includes("N○M✕") && !cardContent?.includes("連答つき")) {
        await button.click();
        break;
      }
    }

    const modal = page.getByRole("dialog");
    await expect(modal).toBeVisible();
    await page.getByLabel("ゲーム名").fill("NomXリーチテスト");
    await page.waitForTimeout(500);

    await page
      .locator('[role="dialog"]')
      .getByRole("button", { name: "作る" })
      .click();

    await expect(page).toHaveURL(/\/online\/games\/.*\/config/);
    await page.waitForLoadState("networkidle");

    // 5○3✕に設定
    const winPointInput = page.getByLabel("正解数（勝ち抜け）");
    await winPointInput.clear();
    await winPointInput.fill("5");

    const losePointInput = page.getByLabel("誤答数（失格）");
    await losePointInput.clear();
    await losePointInput.fill("3");

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

    const correctButton = players[0].getByRole("button").first();

    // プレイヤー1を正解リーチ状態にする（4正解）
    for (let i = 0; i < 4; i++) {
      await correctButton.click();
      await page.waitForTimeout(200);
    }
    await expect(players[0]).toContainText("4-0");
    await expect(players[0]).toHaveClass(/reach/);
  });

  test("勝ち抜け・失格テスト", async ({ page }) => {
    // ゲーム作成（共通処理）
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
      if (cardContent?.includes("N○M✕") && !cardContent?.includes("連答つき")) {
        await button.click();
        break;
      }
    }

    const modal = page.getByRole("dialog");
    await expect(modal).toBeVisible();
    await page.getByLabel("ゲーム名").fill("NomX勝敗テスト");
    await page.waitForTimeout(500);

    await page
      .locator('[role="dialog"]')
      .getByRole("button", { name: "作る" })
      .click();

    await expect(page).toHaveURL(/\/online\/games\/.*\/config/);
    await page.waitForLoadState("networkidle");

    // 5○3✕に設定
    const winPointInput = page.getByLabel("正解数（勝ち抜け）");
    await winPointInput.clear();
    await winPointInput.fill("5");

    const losePointInput = page.getByLabel("誤答数（失格）");
    await losePointInput.clear();
    await losePointInput.fill("3");

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

    // 勝ち抜けテスト（プレイヤー1が5回正解）
    const correctButton = players[0].getByRole("button").first();
    for (let i = 0; i < 5; i++) {
      await correctButton.click();
      await page.waitForTimeout(200);
    }
    await expect(players[0]).toContainText("1st");
    await expect(correctButton).toBeDisabled();

    // 失格テスト（プレイヤー2を失格させる）
    for (let i = 0; i < 3; i++) {
      await players[1].getByRole("button").last().click();
      await page.waitForTimeout(200);
    }
    await expect(players[1]).toContainText("LOSE");
    await expect(players[1].getByRole("button").first()).toBeDisabled();
  });

  test("Undo機能とキーボードショートカット", async ({ page }) => {
    // ゲーム作成（共通処理）
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
      if (cardContent?.includes("N○M✕") && !cardContent?.includes("連答つき")) {
        await button.click();
        break;
      }
    }

    const modal = page.getByRole("dialog");
    await expect(modal).toBeVisible();
    await page.getByLabel("ゲーム名").fill("NomX機能テスト");
    await page.waitForTimeout(500);

    await page
      .locator('[role="dialog"]')
      .getByRole("button", { name: "作る" })
      .click();

    await expect(page).toHaveURL(/\/online\/games\/.*\/config/);
    await page.waitForLoadState("networkidle");

    // 5○3✕に設定
    const winPointInput = page.getByLabel("正解数（勝ち抜け）");
    await winPointInput.clear();
    await winPointInput.fill("5");

    const losePointInput = page.getByLabel("誤答数（失格）");
    await losePointInput.clear();
    await losePointInput.fill("3");

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

    // プレイヤー2を失格手前まで進める
    for (let i = 0; i < 2; i++) {
      await players[1].getByRole("button").last().click();
      await page.waitForTimeout(200);
    }

    // Undo機能テスト
    await page.getByRole("button", { name: "一つ戻す" }).click();
    await page.waitForTimeout(500);
    await expect(players[1]).not.toContainText("LOSE");

    // キーボードショートカット
    await page.keyboard.press("3");
    await page.waitForTimeout(500);
    // プレイヤー3が正解

    await page.keyboard.press("Shift+3");
    await page.waitForTimeout(500);
    // プレイヤー3が誤答
  });
});
