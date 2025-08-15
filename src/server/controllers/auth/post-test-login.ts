import { zValidator } from "@hono/zod-validator";
import { createFactory } from "hono/factory";

import {
  TestLoginRequestSchema,
  type TestLoginResponseType,
} from "@/models/auth";
import {
  createSession,
  createTestUser,
  getUserByEmail,
} from "@/server/repositories/auth";
import { ensureUserPreferences } from "@/server/repositories/user";

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

    // ハードコードされたテストアカウント
    const TEST_EMAIL = "e2e-test@example.com";
    const TEST_PASSWORD = "test123456";

    if (email !== TEST_EMAIL || password !== TEST_PASSWORD) {
      return c.json({ error: "認証情報が正しくありません" }, 401);
    }

    try {
      // ユーザーがDBに存在しない場合は作成
      let existingUser = await getUserByEmail(email);
      if (!existingUser) {
        existingUser = await createTestUser({
          email,
          name: "E2Eテストユーザー",
          emailVerified: true,
        });

        // ユーザー設定も作成
        await ensureUserPreferences(existingUser.id);
      }

      // セッションを作成
      const newSession = await createSession(existingUser.id);

      return c.json({
        user: existingUser,
        session: newSession,
        token: newSession.token,
      } as TestLoginResponseType);
    } catch (error) {
      console.error("テストログインエラー:", error);
      return c.json({ error: "ログインに失敗しました" }, 500);
    }
  }
);
