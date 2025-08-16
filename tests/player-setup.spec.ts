import { expect, test } from "@playwright/test";

test.describe.configure({ mode: "serial" });

test.describe("プレイヤーセットアップ", () => {
  test("テスト用プレイヤーを作成", async ({ page }) => {
    await page.addInitScript(() => {
      window.localStorage.setItem("scorewatcher-version", "latest");
    });

    await page.goto("/online/players");
    await page.waitForLoadState("networkidle");
    await expect(
      page.getByRole("heading", { name: "プレイヤー管理" })
    ).toBeVisible();

    const testPlayerNames = [
      "プレイヤー1",
      "プレイヤー2",
      "プレイヤー3",
      "プレイヤー4",
      "プレイヤー5",
      "プレイヤー6",
      "プレイヤー7",
      "プレイヤー8",
      "プレイヤー9",
      "プレイヤー10",
    ];

    for (const playerName of testPlayerNames) {
      const player = page
        .getByRole("table")
        .getByText(playerName, { exact: true });
      if (await player.isVisible()) {
        continue;
      }

      await page.getByLabel("氏名").fill(playerName);
      await page.getByRole("button", { name: "作成" }).click();

      await expect(
        page.getByRole("table").getByText(playerName, { exact: true })
      ).toBeVisible();
    }
  });
});
