import test, { expect } from "@playwright/test";
import { toZenkakuCase } from "encoding-japanese";

import type { BrowserContext, Page } from "@playwright/test";

let page: Page;
let context: BrowserContext;

test.beforeAll(async ({ browser }) => {
  // context.addInitScript を page に効かせるため、page は context から生成する
  context = await browser.newContext();
  page = await context.newPage();
  await page.goto("http://localhost:3000/");
});

test.describe("アップデートモーダル", () => {
  test.describe.configure({ mode: "default" });

  test("初めてアクセスしたときアップデートモーダルが表示される", async () => {
    const headerEl = page.getByRole("dialog");
    await expect(headerEl).toContainText("新しいバージョンがリリースされました");
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
    // アップデートモーダルは「アップデートモーダル」テストで閉じ済みのため、再読み込みして開始する
    await page.reload();
  });

  test("形式一覧ページに移動できる", async () => {
    // トップページの QuickLinks にも同名リンクがあるため、サイドバー(banner)に限定する
    await page.getByRole("banner").getByRole("link", { name: "形式一覧" }).click();
    await expect(page).toHaveTitle(/形式一覧/);
  });

  test("ゲーム設定ページに移動できる", async () => {
    await page.getByRole("main").getByRole("button", { name: "作る" }).first().click();
    await expect(page).toHaveTitle(/ゲーム設定/);
  });

  test("プレイヤー未選択時ゲーム開始ボタンを押せない", async () => {
    await page.getByRole("button", { name: "ゲーム開始" }).isDisabled();
  });

  test("プレイヤー作成画面に移動できる", async () => {
    await page.getByRole("tab", { name: "プレイヤー設定" }).click();
    await page.getByRole("button", { name: "プレイヤーを選択" }).click();
    await page.getByRole("button", { name: "過去に作成したプレイヤーを追加" }).click();
    await page
      .getByLabel("過去に作成したプレイヤーを追加")
      .getByRole("link", { name: "プレイヤー管理" })
      .click();
    await page.waitForLoadState("domcontentloaded");
    await expect(page).toHaveTitle(/プレイヤー管理/);
  });

  test("プレイヤーを作成できる", async () => {
    const addButtonEl = page.getByRole("button", { name: "追加" });
    for (let i = 1; i <= 5; i++) {
      await page.getByLabel("氏名").fill(`プレイヤー${i}`);
      await addButtonEl.click();
      await expect(page.getByRole("table")).toContainText(`プレイヤー${i}`);
      await page.getByRole("alert").getByRole("button").first().click();
    }
  });

  test("ゲーム一覧ページに作成したゲームが存在する", async ({ isMobile }) => {
    if (isMobile) {
      await page.getByRole("banner").getByRole("button").first().click();
    }
    // トップページの QuickLinks にも同名リンクがあるため、サイドバー(banner)に限定する
    await page.getByRole("banner").getByRole("link", { name: "作成したゲーム" }).click();
    await expect(page).toHaveTitle(/作成したゲーム/);
    const gameEl = page.getByTitle("スコア計算").first();
    await expect(gameEl).toContainText("5人");
    // ゲームカード全体がリンクになっているため、カードをクリックして設定ページへ遷移する
    await gameEl.click();
  });

  test("得点表示のページに移動できる", async () => {
    await page.getByRole("link", { name: "ゲーム開始" }).click();
    await expect(page).toHaveURL(/board/);
    await expect(page.getByRole("banner").locator("span").first()).toContainText("Q1");
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
    await expect(page.getByRole("banner").locator("span").first()).toContainText("Q6");
  });

  test("スルーを実行できる", async ({ isMobile }) => {
    if (isMobile) {
      await page.getByRole("banner").getByRole("button").click();
      await page.getByRole("menuitem", { name: "スルー" }).click();
    } else {
      await page.getByRole("button", { name: "スルー" }).click();
    }
    await expect(page.getByRole("banner").locator("span").first()).toContainText("Q7");
    const log = page.locator("tr").first();
    await expect(log.locator("td").nth(1)).toContainText("(スルー)");
    await expect(log.locator("td").nth(2)).toContainText("-");
  });

  test("undoを実行できる", async ({ isMobile }) => {
    for (let i = 5; i >= 1; i--) {
      if (isMobile) {
        await page.getByRole("banner").getByRole("button").click();
        await page.getByRole("menuitem", { name: "一つ戻す" }).click();
      } else {
        await page.getByRole("button", { name: "一つ戻す" }).click();
      }
      await expect(page.getByRole("banner").locator("span").first()).toContainText(`Q${i + 1}`);
      const log = page.locator("tr").first();
      await expect(log.locator("td").nth(0)).toContainText(`${i}.`);
      await expect(log.locator("td").nth(1)).toContainText(`プレイヤー${i}`);
      await expect(log.locator("td").nth(2)).toContainText("o");
    }
  });
});

test.describe("誤答数の記号表示", () => {
  test.describe.configure({ mode: "default" });

  test.beforeAll(async () => {
    // 「誤答数が4以下のとき✕の数で表示」を有効化した状態で検証する
    await context.addInitScript(() => {
      window.localStorage.setItem("wrongNumber", "true");
    });
    // 初回表示でアップデートモーダルがバージョンを保存するため、reloadで閉じる
    await page.goto("http://localhost:3000/");
    await page.reload();
  });

  test("N○M✕形式のゲームを作成できる", async ({ isMobile }) => {
    if (isMobile) {
      await page.getByRole("banner").getByRole("button").first().click();
    }
    // トップページの QuickLinks にも同名リンクがあるため、サイドバー(banner)に限定する
    await page.getByRole("banner").getByRole("link", { name: "形式一覧" }).click();
    await expect(page).toHaveTitle(/形式一覧/);
    // 「N○M✕」(nomx)と「連答つきN○M✕」(nomx-ad)を区別するため厳密一致で絞り込む
    const card = page
      .locator('[class*="mantine-Card-root"]')
      .filter({ has: page.getByText("N○M✕", { exact: true }) });
    await card.getByRole("button", { name: "作る" }).click();
    await expect(page).toHaveTitle(/ゲーム設定/);
  });

  test("失格誤答数を増やして敗退を防ぐ", async () => {
    // 初期表示は「プレイヤー設定」タブのため、形式設定タブを開く
    await page.getByRole("tab", { name: "形式設定" }).click();
    // 既定では誤答3回で失格になるため、表示検証のため失格誤答数を増やす
    const losePointInput = page.getByLabel("失格誤答数");
    await losePointInput.fill("10");
    await expect(losePointInput).toHaveValue("10");
  });

  test("プレイヤーを作成してゲームを開始できる", async () => {
    await page.getByRole("tab", { name: "プレイヤー設定" }).click();
    await page.getByRole("button", { name: "プレイヤーを選択" }).click();
    // ドロワーの「新しく追加」からプレイヤーを2人作成する
    const dialog = page.getByRole("dialog");
    for (let i = 1; i <= 2; i++) {
      await dialog.getByLabel("氏名").fill(`誤答テスト${i}`);
      await dialog.getByRole("button", { name: "追加する" }).click();
      await page.getByRole("alert").getByRole("button").first().click();
    }
    await page.keyboard.press("Escape");
    const startButton = page.getByRole("link", { name: "ゲーム開始" });
    await expect(startButton).toBeVisible();
    await startButton.click();
    await expect(page).toHaveURL(/board/);
  });

  test("誤答数1〜3のとき✕が誤答数だけ表示される", async () => {
    const wrongButton = page.getByTestId("player").first().getByRole("button").nth(1);
    // 誤答数0のときは中黒で表示される
    await expect(wrongButton).toHaveText("・");
    await wrongButton.click();
    await expect(wrongButton).toHaveText("✕");
    await wrongButton.click();
    await expect(wrongButton).toHaveText("✕✕");
    await wrongButton.click();
    await expect(wrongButton).toHaveText("✕✕✕");
  });

  test("誤答数が4を超えると数値表示になり○が付かない", async () => {
    const wrongButton = page.getByTestId("player").first().getByRole("button").nth(1);
    // 誤答数3の状態から5まで増やす
    await wrongButton.click();
    await wrongButton.click();
    await expect(wrongButton).toContainText("5✕");
    await expect(wrongButton).not.toContainText("○");
  });

  test("記号付与がオフのとき誤答数5以上は数値のみ表示される", async () => {
    // 「スコアに○✕ptの文字列を付与する」をオフにして再読み込みする
    await page.evaluate(() => window.localStorage.setItem("showSignString", "false"));
    await page.reload();
    // 直前のテストで誤答数は5になっている
    const wrongButton = page.getByTestId("player").first().getByRole("button").nth(1);
    await expect(wrongButton).toHaveText("5");
    await expect(wrongButton).not.toContainText("✕");
    await expect(wrongButton).not.toContainText("○");
  });

  test("表示設定の切り替えがスコア操作なしで即座に反映される", async () => {
    // 直前のテストで showSignString=false。誤答数0の2人目で wrongNumber の切り替えを検証する
    const wrongButton = page.getByTestId("player").nth(1).getByRole("button").nth(1);
    await expect(wrongButton).toHaveText("・");
    // 「表示設定」ドロワーを開き、得点ボタンを押さずにスイッチを切り替える
    await page.getByRole("button", { name: "表示設定" }).click();
    await page.getByLabel("誤答数が4以下のとき✕の数で表示").click();
    // 得点操作をしていないが、スイッチ変更で表示が即座に更新される
    await expect(wrongButton).toHaveText("0");
  });
});
