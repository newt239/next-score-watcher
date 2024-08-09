import test, { BrowserContext, expect, Page } from "@playwright/test";
import { toZenkakuCase } from "encoding-japanese";

let page: Page;
let context: BrowserContext;

test.beforeAll(async ({ browser }) => {
  page = await browser.newPage();
  context = await browser.newContext();
  await page.goto("http://localhost:3000/");
});

test.describe("アップデートモーダル", () => {
  test.describe.configure({ mode: "default" });

  test("初めてアクセスしたときアップデートモーダルが表示される", async () => {
    const headerEl = page.getByRole("dialog");
    await expect(headerEl).toContainText(
      "新しいバージョンがリリースされました"
    );
  });

  test("アップデートモーダルを閉じる", async () => {
    await page.getByRole("dialog").locator("button").click();
    const headerEl = page.getByRole("dialog");
    await expect(headerEl).toBeVisible({ visible: false });
  });
});

test.describe("得点表示", () => {
  test.describe.configure({ mode: "default" });

  test.beforeAll(async () => {
    await context.addInitScript(() => {
      // TODO: latest versionを.env.localから取得する
      window.localStorage.setItem("scorewatcher-version", "3.0.2");
    });
    await page.reload();
  });

  test("形式一覧ページに移動できる", async () => {
    await page.getByRole("link", { name: "ゲームを作る" }).click();
    await expect(page).toHaveTitle(/形式一覧/);
  });

  test("ゲーム設定ページに移動できる", async () => {
    await page
      .getByRole("main")
      .getByRole("button", { name: "作る" })
      .first()
      .click();
    await expect(page).toHaveTitle(/ゲーム設定/);
  });

  test("プレイヤー未選択時ゲーム開始ボタンを押せない", async () => {
    await page.getByRole("button", { name: "ゲーム開始" }).isDisabled();
  });

  test("プレイヤー作成画面に移動できる", async () => {
    await page.getByRole("tab", { name: "プレイヤー設定" }).click();
    await page.getByRole("link", { name: "プレイヤーを読み込む" }).click();
    await expect(page).toHaveTitle(/プレイヤー管理/);
  });

  test("プレイヤーを作成できる", async () => {
    for (let i = 1; i <= 5; i++) {
      await page.getByLabel("氏名").fill(`プレイヤー${i}`);
      await page.getByRole("button", { name: "追加" }).click();
      await expect(page.getByRole("table")).toContainText(`プレイヤー${i}`);
    }
  });

  test("ゲーム一覧ページに作成したゲームが存在する", async () => {
    await page.getByRole("link", { name: "作成したゲーム" }).click();
    await expect(page).toHaveTitle(/作成したゲーム/);
    const gameEl = page.getByTitle("スコア計算").first();
    await expect(gameEl).toContainText("5人");
    await gameEl.getByRole("link", { name: "開く" }).click();
  });

  test("得点表示のページに移動できる", async () => {
    await page.getByRole("link", { name: "ゲーム開始" }).click();
    await expect(page).toHaveURL(/board/);
    await expect(
      page.getByRole("banner").locator("span").first()
    ).toContainText("Q1");
  });

  test("得点表示画面にプレイヤーが正しく表示される", async () => {
    for (let i = 1; i <= 5; i++) {
      const player = page.locator("#players-area > div").nth(i - 1);
      await expect(player.getByTestId("player-name")).toContainText(
        toZenkakuCase(`プレイヤー${i}`)
      );
      const ptButton = player.getByRole("button");
      await expect(ptButton).toContainText("0pt");
      await ptButton.click();
      await expect(ptButton).toContainText("1pt");
      const log = page.locator("tr").first();
      await expect(log.locator("td").nth(0)).toContainText(`${i}.`);
      await expect(log.locator("td").nth(1)).toContainText(`プレイヤー${i}`);
      await expect(log.locator("td").nth(2)).toContainText("o");
    }
    await expect(
      page.getByRole("banner").locator("span").first()
    ).toContainText("Q6");
  });

  test("スルーを実行できる", async () => {
    await page.mouse.wheel(0, 100);
    await page.getByRole("button", { name: "スルー" }).click();
    await expect(
      page.getByRole("banner").locator("span").first()
    ).toContainText("Q7");
    const log = page.locator("tr").first();
    await expect(log.locator("td").nth(1)).toContainText("(スルー)");
    await expect(log.locator("td").nth(2)).toContainText("-");
  });

  test("undoを実行できる", async () => {
    await page.mouse.wheel(0, 100);
    for (let i = 5; i >= 1; i--) {
      await page.getByRole("button", { name: "一つ戻す" }).click();
      await expect(
        page.getByRole("banner").locator("span").first()
      ).toContainText(`Q${i + 1}`);
      const log = page.locator("tr").first();
      await expect(log.locator("td").nth(0)).toContainText(`${i}.`);
      await expect(log.locator("td").nth(1)).toContainText(`プレイヤー${i}`);
      await expect(log.locator("td").nth(2)).toContainText("o");
    }
  });
});
