import { expect, test } from "@playwright/test";

/**
 * AQL形式のe2eテスト（簡潔版）
 * 特徴:
 * - 10人固定のチーム戦
 * - 左チーム（1-5番）vs 右チーム（6-10番）
 * - チームスコア積が200以上で勝利
 * - 相手チーム誤答時の自動復活システム
 */
test.describe("AQL形式のテスト", () => {
  test.beforeEach(async ({ page }) => {
    await page.addInitScript(() => {
      window.localStorage.setItem("scorewatcher-version", "latest");
    });
  });

  test("プレイヤー作成", async ({ page }) => {
    // 10人のプレイヤーを作成
    await page.goto("/online/players");
    await page.waitForLoadState("networkidle");

    for (let i = 1; i <= 10; i++) {
      const playerName = `テストプレイヤー${i}`;

      const existingPlayer = page.getByRole("table").getByText(playerName);
      if (await existingPlayer.isVisible()) {
        continue;
      }

      await page.getByLabel("氏名").fill(playerName);
      await page.getByRole("button", { name: "作成" }).click();
      await page.waitForTimeout(500);
    }
    await expect(page.getByRole("table")).toContainText("テストプレイヤー10");
  });

  test("ゲーム作成とチーム設定", async ({ page }) => {
    // AQLゲーム作成
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
      if (cardContent?.includes("AQL")) {
        await button.click();
        break;
      }
    }

    const modal = page.getByRole("dialog");
    await expect(modal).toBeVisible();
    await page.getByLabel("ゲーム名").fill("AQLチーム設定テスト");
    await page.waitForTimeout(500);

    await page
      .locator('[role="dialog"]')
      .getByRole("button", { name: "作る" })
      .click();

    await expect(page).toHaveURL(/\/online\/games\/.*\/config/);
    await page.waitForLoadState("networkidle");

    // チーム名設定
    const leftTeamInput = page.getByLabel("左チーム名");
    await leftTeamInput.clear();
    await leftTeamInput.fill("レッドチーム");

    const rightTeamInput = page.getByLabel("右チーム名");
    await rightTeamInput.clear();
    await rightTeamInput.fill("ブルーチーム");

    await page.getByRole("tab", { name: "プレイヤー設定" }).click();
    await page.waitForLoadState("networkidle");

    await page.getByRole("button", { name: "プレイヤーを選択" }).click();
    await page.waitForTimeout(1000);

    const dialog = page.getByRole("dialog", { name: "プレイヤー選択" });
    await expect(dialog).toBeVisible();

    for (let i = 1; i <= 10; i++) {
      const playerCheckbox = page
        .getByRole("table")
        .getByRole("checkbox", { name: `テストプレイヤー${i}` })
        .first();

      if (await playerCheckbox.isVisible()) {
        await playerCheckbox.check();
      }
    }

    await page.keyboard.press("Escape");
    await page.waitForTimeout(2000);

    await page.getByRole("link", { name: "ゲーム開始" }).click();
    await page.waitForTimeout(2000);

    await expect(page).toHaveURL(/\/online\/games\/.*\/board/);
    await page.waitForLoadState("networkidle");

    // チーム表示確認
    await expect(page.getByText("レッドチーム")).toBeVisible();
    await expect(page.getByText("ブルーチーム")).toBeVisible();

    // プレイヤー表示確認
    for (let i = 1; i <= 10; i++) {
      await expect(page.getByText(`テストプレイヤー${i}`)).toBeVisible();
    }
  });

  test("基本スコア操作", async ({ page }) => {
    // AQLゲーム作成（共通処理）
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
      if (cardContent?.includes("AQL")) {
        await button.click();
        break;
      }
    }

    const modal = page.getByRole("dialog");
    await expect(modal).toBeVisible();
    await page.getByLabel("ゲーム名").fill("AQLスコア操作テスト");
    await page.waitForTimeout(500);

    await page
      .locator('[role="dialog"]')
      .getByRole("button", { name: "作る" })
      .click();

    await expect(page).toHaveURL(/\/online\/games\/.*\/config/);
    await page.waitForLoadState("networkidle");

    // チーム名設定
    const leftTeamInput = page.getByLabel("左チーム名");
    await leftTeamInput.clear();
    await leftTeamInput.fill("レッドチーム");

    const rightTeamInput = page.getByLabel("右チーム名");
    await rightTeamInput.clear();
    await rightTeamInput.fill("ブルーチーム");

    await page.getByRole("tab", { name: "プレイヤー設定" }).click();
    await page.waitForLoadState("networkidle");

    await page.getByRole("button", { name: "プレイヤーを選択" }).click();
    await page.waitForTimeout(1000);

    const dialog = page.getByRole("dialog", { name: "プレイヤー選択" });
    await expect(dialog).toBeVisible();

    for (let i = 1; i <= 10; i++) {
      const playerCheckbox = page
        .getByRole("table")
        .getByRole("checkbox", { name: `テストプレイヤー${i}` })
        .first();

      if (await playerCheckbox.isVisible()) {
        await playerCheckbox.check();
      }
    }

    await page.keyboard.press("Escape");
    await page.waitForTimeout(2000);

    await page.getByRole("link", { name: "ゲーム開始" }).click();
    await page.waitForTimeout(2000);

    await expect(page).toHaveURL(/\/online\/games\/.*\/board/);
    await page.waitForLoadState("networkidle");

    // 基本スコア操作
    const leftPlayer1 = page.locator("#players-area").nth(0); // プレイヤー1
    const rightPlayer1 = page.locator("#players-area").nth(5); // プレイヤー6

    // 左チームプレイヤー1が2回正解
    for (let i = 0; i < 2; i++) {
      await leftPlayer1.getByRole("button").first().click();
      await page.waitForTimeout(200);
    }
    await expect(leftPlayer1).toContainText("2pt");

    // 右チームプレイヤー6が1回正解
    await rightPlayer1.getByRole("button").first().click();
    await page.waitForTimeout(200);
    await expect(rightPlayer1).toContainText("1pt");
  });

  test("失格・復活システム", async ({ page }) => {
    // AQLゲーム作成（共通処理）
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
      if (cardContent?.includes("AQL")) {
        await button.click();
        break;
      }
    }

    const modal = page.getByRole("dialog");
    await expect(modal).toBeVisible();
    await page.getByLabel("ゲーム名").fill("AQL復活システムテスト");
    await page.waitForTimeout(500);

    await page
      .locator('[role="dialog"]')
      .getByRole("button", { name: "作る" })
      .click();

    await expect(page).toHaveURL(/\/online\/games\/.*\/config/);
    await page.waitForLoadState("networkidle");

    // チーム名設定
    const leftTeamInput = page.getByLabel("左チーム名");
    await leftTeamInput.clear();
    await leftTeamInput.fill("レッドチーム");

    const rightTeamInput = page.getByLabel("右チーム名");
    await rightTeamInput.clear();
    await rightTeamInput.fill("ブルーチーム");

    await page.getByRole("tab", { name: "プレイヤー設定" }).click();
    await page.waitForLoadState("networkidle");

    await page.getByRole("button", { name: "プレイヤーを選択" }).click();
    await page.waitForTimeout(1000);

    const dialog = page.getByRole("dialog", { name: "プレイヤー選択" });
    await expect(dialog).toBeVisible();

    for (let i = 1; i <= 10; i++) {
      const playerCheckbox = page
        .getByRole("table")
        .getByRole("checkbox", { name: `テストプレイヤー${i}` })
        .first();

      if (await playerCheckbox.isVisible()) {
        await playerCheckbox.check();
      }
    }

    await page.keyboard.press("Escape");
    await page.waitForTimeout(2000);

    await page.getByRole("link", { name: "ゲーム開始" }).click();
    await page.waitForTimeout(2000);

    await expect(page).toHaveURL(/\/online\/games\/.*\/board/);
    await page.waitForLoadState("networkidle");

    const leftPlayer1 = page.locator("#players-area").nth(0); // プレイヤー1
    const rightPlayer1 = page.locator("#players-area").nth(5); // プレイヤー6

    // 左チームプレイヤー1を失格させる
    for (let i = 0; i < 2; i++) {
      await leftPlayer1.getByRole("button").last().click();
      await page.waitForTimeout(200);
    }
    await expect(leftPlayer1).toHaveClass(/lose/);

    // 右チームプレイヤー6が誤答して左チーム復活
    await rightPlayer1.getByRole("button").last().click();
    await page.waitForTimeout(500);

    // 復活確認
    await expect(leftPlayer1).not.toHaveClass(/lose/);
    await expect(leftPlayer1).toContainText("1pt");
  });

  test("キーボードショートカット", async ({ page }) => {
    // AQLゲーム作成（共通処理）
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
      if (cardContent?.includes("AQL")) {
        await button.click();
        break;
      }
    }

    const modal = page.getByRole("dialog");
    await expect(modal).toBeVisible();
    await page.getByLabel("ゲーム名").fill("AQLキーボードテスト");
    await page.waitForTimeout(500);

    await page
      .locator('[role="dialog"]')
      .getByRole("button", { name: "作る" })
      .click();

    await expect(page).toHaveURL(/\/online\/games\/.*\/config/);
    await page.waitForLoadState("networkidle");

    // チーム名設定
    const leftTeamInput = page.getByLabel("左チーム名");
    await leftTeamInput.clear();
    await leftTeamInput.fill("レッドチーム");

    const rightTeamInput = page.getByLabel("右チーム名");
    await rightTeamInput.clear();
    await rightTeamInput.fill("ブルーチーム");

    await page.getByRole("tab", { name: "プレイヤー設定" }).click();
    await page.waitForLoadState("networkidle");

    await page.getByRole("button", { name: "プレイヤーを選択" }).click();
    await page.waitForTimeout(1000);

    const dialog = page.getByRole("dialog", { name: "プレイヤー選択" });
    await expect(dialog).toBeVisible();

    for (let i = 1; i <= 10; i++) {
      const playerCheckbox = page
        .getByRole("table")
        .getByRole("checkbox", { name: `テストプレイヤー${i}` })
        .first();

      if (await playerCheckbox.isVisible()) {
        await playerCheckbox.check();
      }
    }

    await page.keyboard.press("Escape");
    await page.waitForTimeout(2000);

    await page.getByRole("link", { name: "ゲーム開始" }).click();
    await page.waitForTimeout(2000);

    await expect(page).toHaveURL(/\/online\/games\/.*\/board/);
    await page.waitForLoadState("networkidle");

    // キーボードショートカット
    await page.keyboard.press("1");
    await page.waitForTimeout(500);
    // プレイヤー1正解

    await page.keyboard.press("6");
    await page.waitForTimeout(500);
    // プレイヤー6正解

    await page.keyboard.press("Shift+1");
    await page.waitForTimeout(500);
    // プレイヤー1誤答
  });
});
