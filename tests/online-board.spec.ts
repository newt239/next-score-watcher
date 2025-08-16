import { expect, test } from "@playwright/test";

test.describe("オンライン版得点表示", () => {
  let gameId: string | undefined;

  test.beforeEach(async ({ page }) => {
    // ページを開く前にローカルストレージを設定
    await page.addInitScript(() => {
      window.localStorage.setItem("scorewatcher-version", "latest");
    });
  });

  test("プレイヤーを3人作成できる", async ({ page }) => {
    // プレイヤーページを開く
    await page.goto("/online/players");
    await page.waitForLoadState("networkidle");
    await expect(
      page.getByRole("heading", { name: "プレイヤー管理" })
    ).toBeVisible();

    // プレイヤーを3人追加する
    const testPlayerNames = [
      "テストプレイヤー1",
      "テストプレイヤー2",
      "テストプレイヤー3",
    ];

    // すでにプレイヤーが存在する場合はスキップ
    for (const playerName of testPlayerNames) {
      const player = page.getByRole("table").getByText(playerName);
      if (await player.isVisible()) {
        continue;
      }

      await page.getByLabel("氏名").fill(playerName);
      await page.getByRole("button", { name: "作成" }).click();

      // プレイヤーがテーブルに表示されることを確認
      await expect(page.getByRole("table")).toContainText(playerName);
    }
  });

  test("N○M✕形式のゲームを作成できる", async ({ page }) => {
    // 形式一覧画面に移動し、「N○M✕」を作る
    await page.goto("/online/rules");
    await page.waitForLoadState("networkidle");

    // N○M✕形式のカードが表示されることを確認（正確にマッチするもの）
    await expect(page.getByText("N○M✕", { exact: true })).toBeVisible();

    // すべての「作る」ボタンをチェックし、純粋なN○M✕（連答つきではない）の近くにあるものを探す
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

    // ゲーム作成モーダルが表示される
    const modal = page.getByRole("dialog");
    await expect(modal).toBeVisible();

    // ゲーム名を入力
    const testGameName = "N○M✕テストゲーム";
    await page.getByLabel("ゲーム名").fill(testGameName);
    await page.waitForTimeout(500);

    // 作成ボタンをクリック
    await page
      .locator('[role="dialog"]')
      .getByRole("button", { name: "作る" })
      .click();

    // 設定ページにリダイレクトされる
    await expect(page).toHaveURL(/\/online\/games\/.*\/config/);
    await page.waitForLoadState("networkidle");

    const gameUrl = page.url();
    // https://localhost:3000/online/games/1234567890/config
    gameId = gameUrl.split("/")[5];
    expect(gameId).not.toBeNull();
  });

  test("プレイヤー設定でプレイヤーを選択してゲームを開始できる", async ({
    page,
  }) => {
    // 作成したゲームの設定ページに移動
    await page.goto(`/online/games/${gameId}/config`);
    await page.waitForLoadState("networkidle");

    // プレイヤー設定タブに移動し、作成したプレイヤーを選択
    await page.getByRole("tab", { name: "プレイヤー設定" }).click();
    await page.waitForLoadState("networkidle");

    // 「プレイヤーを選択」ボタンをクリック
    await page.getByRole("button", { name: "プレイヤーを選択" }).click();
    await page.waitForTimeout(1000);

    // プレイヤー選択ダイアログが表示されることを確認
    const dialog = page.getByRole("dialog", { name: "プレイヤー選択" });
    await expect(dialog).toBeVisible();

    // 「テストプレイヤー1」のチェックボックスを選択
    const firstPlayerCheckbox = page
      .getByRole("table")
      .getByRole("checkbox", { name: "テストプレイヤー1" })
      .first();
    await firstPlayerCheckbox.check();

    // ダイアログを閉じる
    await page.keyboard.press("Escape");
    await page.waitForTimeout(3000);

    // プレイヤーがゲームに追加されていることを確認（入力フィールドで確認）
    const playerNameInput = page.getByRole("textbox", { name: "プレイヤー名" });
    // playerNameInputが0個以上存在することを確認
    await expect(playerNameInput).toBeVisible();

    // ゲーム開始ボタンをクリックし、得点表示画面を開く
    await page.getByRole("link", { name: "ゲーム開始" }).click();

    await page.waitForTimeout(3000);

    // ボードページが表示される
    await expect(page).toHaveURL(/\/online\/games\/.*\/board/);
    await page.waitForLoadState("networkidle");

    // 問題番号が表示される（No.1の形式）
    await expect(page.getByText(/No\.\d+/)).toBeVisible();

    // プレイヤーが表示されることを確認（全角に変換されている）
    await expect(page.getByText("テストプレイヤー１")).toBeVisible();
  });
});
