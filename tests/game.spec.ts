import test, { expect } from "@playwright/test";

test.beforeEach(async ({ page }) => {
  await page.goto("http://localhost:3000/");
});

test.describe("アップデートモーダル", () => {
  test.describe.configure({ mode: "default" });

  test("初めてアクセスしたときアップデートモーダルが表示される", async ({
    page,
  }) => {
    const headerEl = page.getByRole("dialog");
    await expect(headerEl).toContainText(
      "新しいバージョンがリリースされました"
    );
  });

  test("アップデートモーダルを閉じる", async ({ page }) => {
    await page.getByRole("dialog").locator("button").click();
    const headerEl = page.getByRole("dialog");
    await expect(headerEl).toBeVisible({ visible: false });
  });
});

test.describe("得点表示", () => {
  test.describe.configure({ mode: "default" });

  test.beforeEach(async ({ page }) => {
    await page.evaluate(() => {
      // TODO: latest versionを.env.localから取得する
      localStorage.setItem("scorewatcher-version", "3.0.2");
    });
    await page.reload();
  });

  test("形式一覧ページに移動できる", async ({ page }) => {
    await page.getByRole("link", { name: "ゲームを作る" }).click();
    await expect(page).toHaveTitle(/形式一覧/);
  });
});
