import { expect, test } from "@playwright/test";

test("has title", async ({ page }) => {
  await page.goto("http://localhost:3000/");
  await expect(page).toHaveTitle("Score Watcher");
  await page.getByText("ゲームを作る").click();
  await expect(page).toHaveTitle(/形式一覧/);
});
