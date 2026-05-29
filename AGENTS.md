# AGENTS.md

このファイルは AI Agents がこのリポジトリで作業する際の具体的なガイダンスを提供します。

## 目次

- [原則](#原則)
- [プロジェクト概要](#プロジェクト概要)
- [主要技術](#主要技術)
- [コマンド一覧](#コマンド一覧)
- [ファイル構造とアーキテクチャ](#ファイル構造とアーキテクチャ)
- [コーディング規約](#コーディング規約)
- [AGENTS.md更新ルール](#agents.md更新ルール)

## 原則

### 日本語による応答

ユーザーとのコミュニケーションやコミットメッセージ、コメント、ログ、ドキュメントは**すべて日本語で記述**してください。

### 確認必須

機能や実装について少しでも不明点があれば必ず質問してください。

### lintの実行

実装後の必須作業として、以下のコマンドを実行してください。

```bash
npx tsc --noEmit && pnpm run lint:fix
```

型エラーやリントエラーが出た場合は、コミット前に必ず修正してください。

### 定期的なコミット

適切な粒度でコミットを行ってください。コミットメッセージは`prefix: message`の形式で記述してください。1行で完結するようにしてください。

### ドキュメントの更新

ユーザーとの会話で新しくプロジェクト全体に共通するルールが指示された場合は、まず`AGENTS.md`を更新してください。

ドキュメントを追加するよう指示があった場合は`docs`以下にMarkdownファイルを作成して記述してください。

## プロジェクト概要

Score Watcher は競技クイズのスコア可視化Webアプリケーションです。Next.jsのApp Routerアーキテクチャを使用しています。

## 主要技術

### フロントエンド

Next.js v15を使用し、TypeScriptで記述します。App Routerを使用し、なるべくサーバーコンポーネントで実装してください。ユーザーとのインタラクションが必要な部分に限り`use client`の使用を許可しますが、その領域は最低限にしてください。

**データ取得とuseEffectについて:**

- **useEffect**: データ取得には使用しないでください。ブラウザAPIアクセスやイベントリスナー登録など、真に必要な場合のみ使用を許可します
- **useEffectとwindow**: `useEffect`や`window`オブジェクトへのアクセスはなるべく行わないでください。`useMemo`や`useCallback`などを使用する際はその理由を明示してください
- **データアクセス**: ユーザーデータはIndexedDBに保存されます。データ操作は`src/utils/db.ts`のDexieクライアントを使用し、リアクティブな取得には`dexie-react-hooks`の`useLiveQuery`を利用してください
- **型アサーションの使用禁止**: 安易に型アサーションを使用しないでください

Reactのガイドも参考にしてください：
https://react.dev/learn/you-might-not-need-an-effect

### スタイリング

UIコンポーネントライブラリの一つである**Mantine**を使用します。新しいUIを実装する際はまずMantineのコンポーネントの使用を検討してください。

デザインのカスタマイズは**CSS Modules**を使用してください。**Tailwind CSSは使用禁止**とします。クラス名はkebab-caseで命名してください。

### データベース

**ユーザーのデータはIndexedDB**に保存しています。データを操作する場合はDexie.jsで生成したクライアントがある`src/utils/db.ts`を使用してください。テーブルは以下のものがあります。

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
pnpm run formatt
pnpm run formatt:fix
pnpm run lint
pnpm run lint:fix
pnpm run stylelint
pnpm run stylelint:fix
pnpm run gen          # CSS Modules Kitによる型生成
```

### テスト実行

```bash
pnpm run playwright    # Playwright E2E テスト
pnpm run vitest       # Vitest ユニットテスト
```

## ファイル構造とアーキテクチャ

### ディレクトリ構成

```bash
src/
├── app/
│   ├── (board)/           # スコアボード表示ページ群
│   ├── (default)/         # メイン管理ページ群
│   ├── _components/       # アプリ全体で使用する共有コンポーネント
│   ├── globals.css        # グローバルスタイル
│   └── layout.tsx         # ルートレイアウト
├── assets/                # 画像などの静的アセット
├── components/            # 共有コンポーネント
├── utils/
│   ├── computeScore/      # ゲーム形式の計算ロジック
│   ├── db.ts              # IndexedDB操作・スキーマ管理
│   ├── types.ts           # TypeScript型定義
│   ├── functions.ts       # 共通ユーティリティ関数
│   ├── rules.ts           # ゲームルール定義
│   └── theme.ts           # Mantineテーマ設定
└── instrumentation.ts     # Next.js 計測設定
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
- コードから明らかな処理についてはコメントを書かないでください。コメントを書く場合は1箇所につき原則として1行以内に収めてください。
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

### データ操作

- ユーザーデータはIndexedDBに保存されます。データ操作は`src/utils/db.ts`のDexieクライアントを使用してください
- リアクティブにデータを取得する場合は`dexie-react-hooks`の`useLiveQuery`を利用してください

### ローディング表示

- 非同期処理を行う際は`useTransition`を使用してローディング表示を行ってください。
- ボタンを連打できないように`disabled`を設定してください。

### AGENTS.md更新ルール

プロジェクト全体に影響する新しいルールや設定が決まった場合：

- このファイルの該当セクションに具体的に記載
- 抽象的表現は避け、実行可能な形で記述
- 将来のセッションで再現可能な内容にする
