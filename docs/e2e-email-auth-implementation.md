# E2Eテスト用メール認証の実装ガイド

## 概要

このドキュメントでは、現在のヘッダーベース認証バイパスに代わって、E2Eテスト専用のメール認証エンドポイントを実装する手順を説明します。この実装により、より実際のユーザー体験に近いE2Eテストが可能になります。

## 現在の状況

- **認証システム**: Better-Auth + TursoDB
- **OAuth**: Googleのみ有効
- **メール認証**: 無効化されている
- **E2Eテスト**: ヘッダーベースの認証バイパスを使用

## 実装手順

### 1. Better-Authでメール認証を有効化

`src/utils/auth/auth.ts`を以下のように修正します：

```typescript
export const auth = betterAuth({
  // ... 既存の設定

  emailAndPassword: {
    // テスト環境またはEMAIL_AUTH環境変数が有効な場合のみ有効化
    enabled:
      process.env.NODE_ENV === "test" ||
      process.env.ENABLE_EMAIL_AUTH === "true",
    requireEmailVerification: false, // テスト用のため検証不要
  },

  // ... 既存の設定
});
```

### 2. バリデーションスキーマの追加

`src/models/auth.ts`を新規作成します：

```typescript
import { z } from "zod";

/**
 * テスト用ログインリクエストスキーマ
 */
export const TestLoginRequestSchema = z.object({
  email: z.string().email("有効なメールアドレスを入力してください"),
  password: z.string().min(6, "パスワードは6文字以上である必要があります"),
});

/**
 * テスト用ログインレスポンス型
 */
export type TestLoginResponseType = {
  user: {
    id: string;
    email: string;
    name: string;
    emailVerified: boolean;
    createdAt: Date;
    updatedAt: Date;
  };
  session: {
    id: string;
    userId: string;
    expiresAt: Date;
    token: string;
  };
  token: string;
};
```

### 3. ユーザー管理リポジトリ関数の追加

`src/server/repositories/auth.ts`に以下の関数を追加します：

```typescript
import { eq } from "drizzle-orm";
import { DBClient } from "@/utils/drizzle/client";
import { user, session } from "@/utils/drizzle/schema";
import { ensureUserPreferences } from "./user";

/**
 * メールアドレスでユーザーを取得
 */
export async function getUserByEmail(email: string) {
  const result = await DBClient.select()
    .from(user)
    .where(eq(user.email, email))
    .limit(1);

  return result[0] || null;
}

/**
 * テスト用ユーザーを作成
 */
export async function createTestUser(userData: {
  email: string;
  name: string;
  emailVerified: boolean;
}) {
  const [newUser] = await DBClient.insert(user)
    .values({
      id: crypto.randomUUID(),
      email: userData.email,
      name: userData.name,
      emailVerified: userData.emailVerified,
      createdAt: new Date(),
      updatedAt: new Date(),
    })
    .returning();

  return newUser;
}

/**
 * セッションを作成
 */
export async function createSession(userId: string) {
  const sessionId = crypto.randomUUID();
  const token = crypto.randomUUID();
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7日後

  const [newSession] = await DBClient.insert(session)
    .values({
      id: sessionId,
      userId,
      token,
      expiresAt,
      createdAt: new Date(),
      updatedAt: new Date(),
    })
    .returning();

  return newSession;
}
```

### 4. テスト専用ログインエンドポイントの実装

`src/server/controllers/auth/post-test-login.ts`を新規作成します：

```typescript
import { zValidator } from "@hono/zod-validator";
import { createFactory } from "hono/factory";
import { TestLoginRequestSchema } from "@/models/auth";
import {
  getUserByEmail,
  createTestUser,
  createSession,
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
    // テスト環境以外では無効
    if (
      process.env.NODE_ENV !== "test" &&
      process.env.ENABLE_EMAIL_AUTH !== "true"
    ) {
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
```

### 5. APIルートへの登録

`src/server/index.ts`にエンドポイントを追加します：

```typescript
// ... 既存のimport

// テスト用認証エンドポイント
import postTestLogin from "./controllers/auth/post-test-login";

const app = new Hono()
  .basePath("/api")
  .use("/*", cors())
  .use("*", logger())

  // ... 既存のルート

  // テスト用認証（テスト環境でのみ有効）
  .route("/auth/test-login", postTestLogin);

// ... 残りのコード
```

### 6. E2Eテストの認証セットアップ更新

`tests/auth-setup.spec.ts`を以下のように更新します：

```typescript
import { expect, test as setup } from "@playwright/test";

const authFile = "tests/temp/auth/user.json";

/**
 * メール認証ベースのE2Eテスト認証セットアップ
 */
setup("メール認証テストセットアップ", async ({ page }) => {
  // テスト用認証エンドポイントでログイン
  const response = await page.request.post("/api/auth/test-login", {
    data: {
      email: "e2e-test@example.com",
      password: "test123456",
    },
  });

  if (!response.ok()) {
    throw new Error(`認証に失敗しました: ${response.status()}`);
  }

  const { token } = await response.json();

  // セッショントークンをクッキーに設定
  await page.context().addCookies([
    {
      name: "better-auth.session_token",
      value: token,
      domain: "localhost",
      path: "/",
      httpOnly: true,
      secure: false,
      sameSite: "Lax",
    },
  ]);

  // ホームページにアクセスして認証状態を確認
  await page.goto("/");

  // 認証が成功していることを確認（サインインページにリダイレクトされない）
  await expect(page).not.toHaveURL("/sign-in");

  // 認証状態をストレージに保存
  await page.context().storageState({ path: authFile });
});
```

### 7. 環境変数の設定

`.env.test`ファイルを作成または更新します：

```bash
# テスト環境用の環境変数
NODE_ENV=test
ENABLE_EMAIL_AUTH=true

# その他既存の環境変数
TURSO_DATABASE_URL=your_test_db_url
TURSO_AUTH_TOKEN=your_test_auth_token
BETTER_AUTH_SECRET=your_test_auth_secret
```

### 8. 既存認証バイパスの削除

実装完了後、以下のファイルから既存のヘッダーベース認証バイパス機能を削除します：

- `src/utils/auth/auth-helpers.ts` のテスト環境分岐処理
- `src/server/repositories/auth.ts` の対応するヘッダーチェック処理

## セキュリティ考慮事項

### 重要な注意点

1. **環境制限**: このエンドポイントは`NODE_ENV=test`または`ENABLE_EMAIL_AUTH=true`の場合のみ有効化される
2. **固定クレデンシャル**: テスト用の固定されたメールアドレスとパスワードを使用
3. **プロダクション無効化**: プロダクション環境では絶対に有効化しない

### 推奨セキュリティ設定

```typescript
// プロダクション環境での追加チェック例
if (process.env.VERCEL_ENV === "production") {
  return c.json({ error: "本機能はプロダクション環境では利用できません" }, 403);
}
```

## テストでの使用方法

### 基本的な使用例

```typescript
test("オンライン機能のテスト", async ({ page }) => {
  // 認証済み状態でテスト開始（auth-setupで設定済み）
  await page.goto("/online/games");

  // ゲーム作成などのテスト実行
  await page.click('[data-testid="create-game-button"]');
  // ...
});
```

### 複数ユーザーのテスト

複数ユーザーのテストが必要な場合は、異なるクレデンシャルを追加で定義できます。

## トラブルシューティング

### よくある問題

1. **エンドポイントが404**: ルート登録が正しくされているか確認
2. **認証に失敗**: 環境変数`ENABLE_EMAIL_AUTH`が設定されているか確認
3. **クッキーが設定されない**: ドメインとパスの設定を確認

### デバッグ方法

```typescript
// ログ出力でデバッグ
console.log("Environment:", process.env.NODE_ENV);
console.log("Email auth enabled:", process.env.ENABLE_EMAIL_AUTH);
```

## 実装完了後の確認事項

- [ ] Better-Authでメール認証が有効化されている（テスト環境のみ）
- [ ] バリデーションスキーマが正しく定義されている
- [ ] テスト専用エンドポイントが実装されている
- [ ] APIルートに登録されている
- [ ] E2Eテストの認証セットアップが更新されている
- [ ] 環境変数が正しく設定されている
- [ ] セキュリティチェックが実装されている
- [ ] 既存のヘッダーベース認証バイパスが削除されている

この実装により、E2Eテストでより実際のユーザー体験に近いテストシナリオが実行でき、オンライン機能の品質向上が期待できます。
