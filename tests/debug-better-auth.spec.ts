import { test } from "@playwright/test";

import {
  cleanupTestSession,
  createSessionInDatabase,
  generateSessionData,
  setAuthenticationState,
} from "./test-helpers";

test.describe("Better Auth認証デバッグ", () => {
  let sessionData: {
    sessionId: string;
    sessionToken: string;
    userId: string;
    expiresAt: Date;
  };

  test.beforeEach(async ({ context, page }) => {
    // テスト用セッションデータを生成
    sessionData = generateSessionData();
    console.log("Generated session data:", sessionData);

    // データベースにセッションを作成
    await createSessionInDatabase(sessionData);
    console.log("Session created in database");

    // ブラウザに認証状態を設定
    await setAuthenticationState(context, sessionData.sessionToken);

    // ページを開く前にローカルストレージを設定
    await page.addInitScript(() => {
      window.localStorage.setItem("scorewatcher-version", "latest");
    });
  });

  test.afterEach(async () => {
    // テスト後にセッションをクリーンアップ
    await cleanupTestSession(sessionData.sessionId);
  });

  test("Better Auth APIエンドポイントでセッション確認", async ({
    page,
    context,
  }) => {
    // Better AuthのAPI経由でセッション確認
    const sessionResponse = await page.request.get("/api/auth/session");
    console.log("Session API response status:", sessionResponse.status());

    if (sessionResponse.ok()) {
      const sessionData = await sessionResponse.json();
      console.log("Session API response:", sessionData);
    } else {
      console.log("Session API error:", await sessionResponse.text());
    }

    // コンテキストからクッキーを確認
    const cookies = await context.cookies();
    console.log("All cookies:", cookies);

    const sessionCookie = cookies.find(
      (c) => c.name === "better-auth.session_token"
    );
    console.log("Session cookie found:", !!sessionCookie);
    if (sessionCookie) {
      console.log("Session cookie value:", sessionCookie.value);
    }

    // ページでクッキーアクセステスト
    await page.goto("/");
    const documentCookies = await page.evaluate(() => document.cookie);
    console.log("Document cookies:", documentCookies);
  });

  test("手動でセッション検証APIを呼び出し", async ({ _page }) => {
    // セッション検証のための手動APIコール
    const response = await fetch("http://localhost:3000/api/auth/session", {
      method: "GET",
      headers: {
        Cookie: `better-auth.session_token=${sessionData.sessionToken}`,
      },
    });

    console.log("Manual API call status:", response.status);

    if (response.ok) {
      const data = await response.json();
      console.log("Manual API call response:", data);
    } else {
      const errorText = await response.text();
      console.log("Manual API call error:", errorText);
    }
  });

  test("データベース内のセッション状態を確認", async ({ page }) => {
    // テスト用エンドポイントでセッション状態を確認
    const dbCheckResponse = await page.request.get(
      `/api/test/check-session/${sessionData.sessionId}`
    );

    console.log("DB check response status:", dbCheckResponse.status());

    if (dbCheckResponse.ok()) {
      const dbData = await dbCheckResponse.json();
      console.log("Database session data:", dbData);
    }
  });

  test("オンラインページアクセス前後のクッキー変化", async ({
    page,
    context,
  }) => {
    console.log("=== 初期状態 ===");
    let cookies = await context.cookies();
    let sessionCookie = cookies.find(
      (c) => c.name === "better-auth.session_token"
    );
    console.log("初期セッションクッキー:", sessionCookie?.value);

    console.log("=== ホームページアクセス ===");
    await page.goto("/");
    cookies = await context.cookies();
    sessionCookie = cookies.find((c) => c.name === "better-auth.session_token");
    console.log("ホームページ後のセッションクッキー:", sessionCookie?.value);
    console.log("ホームページURL:", page.url());

    console.log("=== オンラインページアクセス ===");
    await page.goto("/online/games");
    cookies = await context.cookies();
    sessionCookie = cookies.find((c) => c.name === "better-auth.session_token");
    console.log(
      "オンラインページ後のセッションクッキー:",
      sessionCookie?.value
    );
    console.log("オンラインページURL:", page.url());

    // セッションAPIの状態もチェック
    const sessionResponse = await page.request.get("/api/auth/session");
    console.log(
      "Session API status after online access:",
      sessionResponse.status()
    );
  });
});
