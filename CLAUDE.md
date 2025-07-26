# CLAUDE.md

このファイルは Claude Code (claude.ai/code) がこのリポジトリで作業する際の具体的なガイダンスを提供します。

## 原則

### 日本語による応答

ユーザーとのコミュニケーションやコミットメッセージ、コメントは**すべて日本語で記述**してください。

### コマンドの実行確認

コマンドを実行する前に、必ずユーザーに実行確認を行ってください。その際、なぜそのコマンドを実行する必要があるのか説明してください。

### lintの実行

実装後の必須作業として、以下のコマンドを実行してください。

```bash
npx tsc --noEmit && pnpm run lint
```

型エラーやリントエラーが出た場合は、コミット前に必ず修正してください。

### ドキュメントの更新

ユーザーとの会話で新しくプロジェクト全体に共通するルールが指示された場合は、まず`CLAUDE.md`を更新してください。

ドキュメントを追加するよう指示があった場合は`docs`以下にMarkdownファイルを作成して記述してください。文章は箇条書きではなく、段落として記述してください。

## プロジェクト概要

Score Watcher は競技クイズのスコア可視化Webアプリケーションです。Next.jsのApp Routerアーキテクチャを使用しています。

## 主要技術

### フロントエンド

Next.js v15を使用し、TypeScriptで記述します。App Routerを使用しているため、なるべくサーバーコンポーネントで実装してください。ユーザーとのインタラクションが必要な部分に限り`use client`の使用を許可しますが、その領域は最低限にしてください。

### スタイリング

UIコンポーネントライブラリの一つであるMantineを使用します。新しいUIを実装する際はまずMantineのコンポーネントの使用を検討してください。

デザインのカスタマイズはCSS Modulesを使用してください。Tailwind CSSは使用禁止とします。クラス名はkebab-caseで命名してください。

### データベース

ユーザーのデータはIndexedDBに保存しています。データを操作する場合はDexie.jsで生成したクライアントがある`src/utils/db.ts`を使用してください。テーブルは以下のようなものがあります。

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
pnpm run lint         # ESLint + Prettier + Stylelint実行 (実装後必須)
pnpm run prettier      # Prettier実行
pnpm run eslint       # TypeScript/JavaScript リント
pnpm run stylelint    # CSS リント（自動修正）
pnpm run gen          # CSS Modules TypeScript定義生成
```

### テスト実行

```bash
pnpm run playwright    # Playwright E2E テスト
pnpm run vitest       # Vitest ユニットテスト
pnpm run vitest:ui    # Vitest ユニットテスト（UI付き）
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
│   ├── supabase/          # Supabase認証・同期処理
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

**ファイル場所:** `src/utils/computeScore/`

**対応ゲーム形式:**

- normal, nomx, ny, swedish, backstream, z, aql, linear等
- 各形式は独立したファイルで実装
- 共通インターフェースを使用して統一的に処理

## コーディング規約

### TypeScript規約

- **型定義**: `type`を使用（`interface`禁止）
- **パスエイリアス**: `@/`で`src/`を参照
- **厳密な型付け**: 全エンティティに型定義必須
- **CSS Modules**: 自動生成されたTypeScript定義を使用

### スタイリング規約

- **CSS Modules**: PostCSS + Mantine プリセット使用
- **プロパティ順序**: Stylelintのrecess-orderに従う
- **レスポンシブ**: モバイルファーストで実装
- **命名**: kebab-caseで命名

### ファイル作成・編集ルール

1. **新しいコンポーネント作成時**:
   - 既存コンポーネントのパターンを確認
   - 同じディレクトリ内の命名規則に従う
   - CSS Modulesファイルも合わせて作成

2. **ユーティリティ関数追加時**:
   - `src/utils/functions.ts`に追加するか検討
   - 型定義は`src/utils/types.ts`で管理

3. **ゲームロジック変更時**:
   - `src/utils/computeScore/`内の対応ファイルを編集
   - テストファイルも合わせて更新

### CLAUDE.md更新ルール

プロジェクト全体に影響する新しいルールや設定が決まった場合：

- このファイルの該当セクションに具体的に記載
- 抽象的表現は避け、実行可能な形で記述
- 将来のClaude Codeセッションで再現可能な内容にする
