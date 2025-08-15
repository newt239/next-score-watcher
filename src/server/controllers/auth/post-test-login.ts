import { zValidator } from "@hono/zod-validator";
import { setCookie } from "hono/cookie";
import { createFactory } from "hono/factory";

import { TestLoginRequestSchema } from "@/models/auth";
import { auth } from "@/utils/auth/auth";

const factory = createFactory();

/**
 * テスト専用ログインエンドポイント
 * E2Eテストでのみ使用される固定クレデンシャルでのログイン機能
 */
export default factory.createHandlers(
  zValidator("json", TestLoginRequestSchema),
  async (c) => {
    // 本番環境では無効
    if (process.env.NODE_ENV === "production") {
      return c.json({ error: "このエンドポイントは利用できません" }, 403);
    }

    const { email, password } = c.req.valid("json");

    // テストアカウントのパターンチェック
    const TEST_EMAIL_PATTERN = /^e2e-test(-\d+)?@example\.com$/;
    const TEST_PASSWORD = "test123456";

    if (!TEST_EMAIL_PATTERN.test(email) || password !== TEST_PASSWORD) {
      return c.json({ error: "認証情報が正しくありません" }, 401);
    }

    try {
      // Better Auth APIを使用してユーザーとcredential accountを作成
      const signUpResult = await auth.api.signUpEmail({
        body: {
          email,
          password,
          name: "E2Eテストユーザー",
        },
        headers: c.req.raw.headers,
      });

      if (!signUpResult) {
        return c.json({ error: "ユーザー作成に失敗しました" }, 500);
      }

      // Better Auth APIを使用してサインイン
      const signInResult = await auth.api.signInEmail({
        body: {
          email,
          password,
        },
        headers: c.req.raw.headers,
      });

      if (!signInResult) {
        return c.json({ error: "サインインに失敗しました" }, 500);
      }

      // レスポンス構造をログで確認
      console.log("signInResult:", JSON.stringify(signInResult, null, 2));

      // セッショントークンをクッキーに設定
      const sessionToken = signInResult.token;
      if (sessionToken) {
        setCookie(c, "better-auth.session_token", sessionToken, {
          path: "/",
          httpOnly: true,
          sameSite: "Lax",
          maxAge: 604800, // 7日間
        });
      }

      return c.json({
        user: signInResult.user,
        token: sessionToken,
        message: "テストユーザー作成・サインイン完了",
      } as const);
    } catch (error) {
      console.error("テストユーザー準備エラー:", error);
      return c.json(
        {
          error: "テストユーザー準備に失敗しました",
          details: error instanceof Error ? error.message : String(error),
        },
        500
      );
    }
  }
);
