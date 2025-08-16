# CLAUDE.md

このファイルは Claude Code (claude.ai/code) がこのリポジトリで作業する際の具体的なガイダンスを提供します。

## 目次

- [原則](#原則)
- [プロジェクト概要](#プロジェクト概要)
- [主要技術](#主要技術)
- [コマンド一覧](#コマンド一覧)
- [ファイル構造とアーキテクチャ](#ファイル構造とアーキテクチャ)
- [コーディング規約](#コーディング規約)
- [CLAUDE.md更新ルール](#claude.md更新ルール)

## 原則

### 日本語による応答

ユーザーとのコミュニケーションやコミットメッセージ、コメント、ログ、ドキュメントは**すべて日本語で記述**してください。

### 確認必須

機能や実装について少しでも不明点があれば必ず質問してください。

### コマンドの実行確認

コマンドを実行する前に、必ずユーザーに実行確認を行ってください。その際、なぜそのコマンドを実行する必要があるのか説明してください。ただし、以下に示すlintの実行についてはユーザーに確認する必要はありません。

### lintの実行

実装後の必須作業として、以下のコマンドを実行してください。

```bash
npx tsc --noEmit && pnpm run lint:fix
```

型エラーやリントエラーが出た場合は、コミット前に必ず修正してください。

### ドキュメントの更新

ユーザーとの会話で新しくプロジェクト全体に共通するルールが指示された場合は、まず`CLAUDE.md`を更新してください。

ドキュメントを追加するよう指示があった場合は`docs`以下にMarkdownファイルを作成して記述してください。文章は箇条書きではなく、段落として記述してください。

### オンライン機能のURL命名

オンライン機能のURLは`/online/...`で統一してください。`cloud-`プレフィックスは使用しません。関数名、変数名、型名、ファイル名にも`cloud-`は使用しないでください。

## プロジェクト概要

Score Watcher は競技クイズのスコア可視化Webアプリケーションです。Next.jsのApp Routerアーキテクチャを使用しています。

## 主要技術

### フロントエンド

Next.js v15を使用し、TypeScriptで記述します。App Routerを使用し、なるべくサーバーコンポーネントで実装してください。ユーザーとのインタラクションが必要な部分に限り`use client`の使用を許可しますが、その領域は最低限にしてください。

**データ取得とuseEffectについて:**

- **初期データ取得**: page.tsxでサーバーコンポーネントとして実装し、propsでコンポーネントに渡してください
- **useEffect**: データ取得には使用しないでください。ブラウザAPIアクセスやイベントリスナー登録など、真に必要な場合のみ使用を許可します
- **API Routes経由でのデータアクセス**: コンポーネントから`repositories`以下の関数を直接呼び出さないでください。必ずAPI Routes経由で取得してください
- **型アサーションの使用禁止**: 安易に型アサーションを使用しないでください。APIレスポンスは型を信頼し、そのまま受け入れてください

**Server Actionsは使用禁止とします。** すべてAPI Routesのエンドポイントとして実装してください。

例：

- ❌ Server Actions
- ✅ API Routes (`/api/...`) + Honoクライアント

Reactのガイドも参考にしてください：
https://react.dev/learn/you-might-not-need-an-effect

### スタイリング

UIコンポーネントライブラリの一つである**Mantine**を使用します。新しいUIを実装する際はまずMantineのコンポーネントの使用を検討してください。

デザインのカスタマイズは**CSS Modules**を使用してください。**Tailwind CSSは使用禁止**とします。クラス名はkebab-caseで命名してください。

### データベース

**ユーザーのデータはIndexedDB**に保存しています。データを操作する場合はDexie.jsで生成したクライアントがある`src/utils/db.ts`を使用してください。テーブルは以下のようなものがあります。

- `users` - ユーザー情報
- `games` - ゲーム情報
- `players` - プレイヤー情報
- `logs` - ゲーム操作ログ（元に戻す/やり直し用）
- `quizes` - クイズ問題

### PWA機能

オフラインでの動作に対応させるため、サービスワーカーを使用しています。

## コマンド一覧

### 基本コマンド

```bash
pnpm install          # 依存関係のインストール
pnpm run dev          # Turbo使用での開発サーバー起動 (localhost:3000)
pnpm run build        # プロダクションビルド
pnpm run start        # プロダクションサーバー起動
```

### 品質管理

```bash
pnpm run lint         # ESLint + Prettier + Stylelint実行
pnpm run prettier
pnpm run prettier:fix
pnpm run eslint
pnpm run eslint:fix
pnpm run stylelint
pnpm run stylelint:fix
pnpm run gen          # CSS Modules Kitによる型生成
```

### データベース

```bash
pnpm run db:generate   # データベーススキーマ生成
pnpm run db:migrate    # データベースマイグレーション
pnpm run db:studio     # データベーススキーマ確認
pnpm run db:push       # データベーススキーマをデプロイ
```

### テスト実行

```bash
pnpm run playwright    # Playwright E2E テスト
pnpm run vitest       # Vitest ユニットテスト
```

## ファイル構造とアーキテクチャ

### ディレクトリ構成

```
src/
├── app/
│   ├── (board)/           # スコアボード表示ページ群
│   ├── (default)/         # メイン管理ページ群
│   └── globals.css        # グローバルスタイル
├── components/            # 再利用可能なUIコンポーネント
├── utils/
│   ├── computeScore/      # 17種類のゲーム形式の計算ロジック
│   ├── db.ts              # IndexedDB操作・スキーマ管理
│   ├── types.ts           # TypeScript型定義
│   ├── functions.ts       # 共通ユーティリティ関数
│   ├── rules.ts           # ゲームルール定義
│   └── theme.ts           # Mantineテーマ設定
```

### データベース設計

**IndexedDB テーブル（Dexie.js使用）:**

- `games` - ゲーム情報
- `players` - プレイヤー情報
- `logs` - ゲーム操作ログ（元に戻す/やり直し用）
- `quizes` - クイズ問題

**操作場所:**

- データベース初期化: `src/utils/db.ts`
- スキーマバージョニング: `src/utils/db.ts`
- 型定義: `src/utils/types.ts`

### スコア計算システム

各形式のロジックは`docs/rules`以下に仕様書があります。

**ファイル場所:** `src/utils/computeScore/`

**対応ゲーム形式:**

- normal, nomx, ny, swedish, backstream, z, aql, linear等
- 各形式は独立したファイルで実装
- 共通インターフェースを使用して統一的に処理

## コーディング規約

### TypeScript規約

- 原則としてアロー関数を使用してください。
- コンポーネントは原則として`default`でexportしてください。
- 決して`any`を使用しないでください。
- 型定義には `type`を使用してください。`interface`は禁止です。
- 原則として型アサーションを使用しないでください。使用する場合は明確な理由が必要です。
- パスエイリアスは`@/`で`src/`を参照してください。
- CSS Modulesは自動生成されたTypeScript定義を使用してください。
- テストは原則としてVitestを使用してください。
- 関数を定義する際は必ずJSDocを記述してください。また、関数の返り値やAPIの返り値は必ず`as const`を使用してください。
- エラーを解消するためにESLintのルールを変更するのは禁止です。

### スタイリング規約

- CSS ModulesはPostCSS + Mantine プリセット使用してください。
- プロパティ順序はStylelintのrecess-orderに従ってください。
- レスポンシブはモバイルファーストで実装してください。
- 命名はkebab-caseで命名してください。

### ファイル作成・編集ルール

1. 新しいコンポーネント作成時:
   - 既存コンポーネントのパターンを確認
   - 同じディレクトリ内の命名規則に従う
   - CSS Modulesファイルも合わせて作成

2. ユーティリティ関数追加時:
   - `src/utils/functions.ts`に追加するか検討
   - 型定義は`src/utils/types.ts`で管理

3. ゲームロジック変更時:
   - `src/utils/computeScore/`内の対応ファイルを編集
   - テストファイルも合わせて更新

### API Routes

**Server Actionsは使用禁止とします。** すべてAPI Routesで実装してください。

- データベースとのやり取りが必要な場合は`src/server`以下に新たなエンドポイントを実装してください
- API RoutesのルートはすべてHonoで管理します
- エントリーポイントは`src/server/index.ts`で管理します
- ルートを追加する際は`src/server/index.ts`に追加してください
- コントローラーの実装は`src/server/controllers/`に追加してください
- **バリデーションには必ず`zValidator`を使用**してください（リクエストボディ、クエリパラメータ両方）
- **バリデーションスキーマは`src/models/`で定義**し、UpperCamelCaseで命名してください
- データベースとのやり取りは`src/utils/cloud-db.ts`や`repositories`以下で行ってください
- **APIクライアント**: クライアントサイドでは`apiClient`、サーバーサイドでは`createApiClientOnServer()`を使用してください。生のfetchは使用しないでください

**バリデーション実装例:**

```typescript
import { zValidator } from "@hono/zod-validator";
import { GetPlayersQuerySchema } from "@/models/players";

const handler = factory.createHandlers(
  zValidator("query", GetPlayersQuerySchema), // クエリパラメータ
  zValidator("json", CreatePlayerSchema), // リクエストボディ
  async (c) => {
    const query = c.req.valid("query");
    const body = c.req.valid("json");
    // 処理...
  }
);
```

**Controllers構成ルール:**

- `src/server/controllers/`以下のハンドラーは1ファイルにつき1個とします
- 機能ごとにディレクトリを分割してください（`game/`, `player/`, `user/`, `auth/`など）
- ファイル名はメソッドタイプ-機能名の形式で命名してください
  - 例: `game/get-list.ts`, `game/post-create.ts`, `game/get-detail.ts`, `game/patch-update.ts`
  - 例: `player/get-list.ts`, `player/post-create.ts`
  - 例: `user/get-preferences.ts`, `user/update-preferences.ts`
- 各ファイルでは`default export`でハンドラーをエクスポートしてください
- `src/server/index.ts`でimportして使用してください
- **必ず`factory.createHandlers`を使用してください**: 既存の実装パターンに合わせて、すべてのハンドラーで`createFactory()`から生成したfactoryの`createHandlers`メソッドを使用してください
- **既存ファイルとの統合を優先**: 新しい機能を実装する際は、新しいファイルを作成するのではなく、既存の同種ファイル（例：`models/player.ts`、`repositories/player.ts`）に機能を追加してください

### Models管理

サーバーサイドの型定義とスキーマ定義は`src/models/`で機能ごとに管理してください。

**ファイル構成:**

```
src/models/
├── game.ts            # ゲーム関連の型定義・スキーマ
├── player.ts          # プレイヤー関連の型定義・スキーマ
└── user-preference.ts # ユーザー設定関連の型定義・スキーマ
```

**使用ルール:**

- 各機能のZodスキーマは対応するmodelsファイルで定義してください
- スキーマ名は**UpperCamelCase**で命名してください（例：`CreateGameSchema`, `UpdateUserPreferencesSchema`）
- 各エンドポイントのリクエストを定義するスキーマや型名は、先頭をCRUDの動詞にしたうえで、リクエストのスキーマなのか、レスポンスのスキーマなのかを明示してください（例：`CreateGameRequestSchema`, `UpdateUserPreferencesResponseType`）
- TypeScriptの型定義もmodelsファイルで管理してください
- Controllers・Repositoriesからmodelsファイルを`@/models/`でimportして使用してください
- バリデーションスキーマと型定義を同じファイルで管理することで、保守性を向上させてください
- 新しい機能を追加する際は、対応するmodelsファイルを作成してください
- **データ変換関数の禁止**: modelsディレクトリには型とスキーマのみ配置してください。レスポンスデータを変換する関数は作成しないでください。APIレスポンスはそのまま受け入れてください

### ローディング表示

- APIリクエストを行う際は`useTransition`を使用してローディング表示を行ってください。
- ボタンを連打できないように`disabled`を設定してください。

### オンライン機能の実装パターン

オンライン機能（Turso DBとの連携）を実装する際の標準パターン：

1. **サーバーサイド データ取得パターン**:

```typescript
const OnlinePlayerPage = async () => {
  const user = await getUser();
  if (!user) {
    redirect("/sign-in");
  }

  const apiClient = await createApiClientOnServer();
  let initialData: ApiDataType[] = [];
  try {
    const response = await apiClient.endpoint.$get({ query: {} });
    if (response.ok) {
      const data = await response.json();
      initialData = data.data.items || [];
    }
  } catch (error) {
    console.error("Failed to fetch initial data:", error);
  }

  return <OnlineComponent initialData={initialData} />;
};
```

2. **クライアント側API通信パターン**:

```typescript
// フロントエンド側ではapiClientを使用
import apiClient from "@/utils/hono/browser";

const response = await apiClient.endpoint.$get({ query: {} });
const data = await response.json();
```

3. **型定義パターン**:

```typescript
// APIレスポンス専用の型を定義（createdAt/updatedAtはstring）
export type ApiDataType = {
  id: string;
  name: string;
  createdAt?: string; // API responseは常にstring
  updatedAt?: string;
};
```

### CLAUDE.md更新ルール

プロジェクト全体に影響する新しいルールや設定が決まった場合：

- このファイルの該当セクションに具体的に記載
- 抽象的表現は避け、実行可能な形で記述
- 将来のClaude Codeセッションで再現可能な内容にする

## 追加メモリ

- `src/utils/types.ts`はローカル版のDBの型です。オンライン版の型はmodelsの下にあるので、ここの物を使うか、新たにここに実装するようにしてください
- Pull Requestを作成する際は原則として`develop`ブランチに対して作成してください。
- 適切な粒度でコミットを行ってください。
