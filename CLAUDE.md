# CLAUDE.md

このファイルは Claude Code (claude.ai/code) がこのリポジトリで作業する際の具体的なガイダンスを提供します。

## プロジェクト概要

Score Watcher は競技クイズのスコア可視化WebアプリケーションでNext.jsのApp Routerアーキテクチャを使用しています。以下の技術要素で構成されています：

- **フロントエンド**: Next.js 14, TypeScript, Mantine UI, CSS Modules
- **データベース**: IndexedDB (Dexie.js) + Supabase (クラウド同期)
- **PWA機能**: オフライン対応、サービスワーカー
- **ゲーム形式**: 17種類の競技クイズ形式 (normal, nomx, ny, swedish等)

## 必須開発ワークフロー

### 実装後の必須作業

**重要**: すべてのコード変更・実装完了後は必ず以下を実行してください：

```bash
pnpm run lint
```

リントエラーが出た場合は、コミット前に必ず修正してください。

### 基本コマンド

```bash
pnpm install          # 依存関係のインストール
pnpm run dev          # Turbo使用での開発サーバー起動 (localhost:3000)
pnpm run build        # プロダクションビルド
pnpm run start        # プロダクションサーバー起動
```

### 品質管理

```bash
pnpm run lint         # ESLint + Stylelint実行 (実装後必須)
pnpm run eslint       # TypeScript/JavaScript リント
pnpm run stylelint    # CSS リント（自動修正）
pnpm run gen          # CSS Modules TypeScript定義生成
```

### テスト実行

```bash
pnpm run test         # Playwright E2E テスト（UI付き）
pnpm run test:unit    # Vitest ユニットテスト
pnpm run test:unit:ui # Vitest ユニットテスト（UI付き）
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
- **命名**: BEMベースのクラス名使用

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

### テスト実装規約

**E2E テスト（Playwright）:**
- ロケール: ja-JP使用
- テスト対象: ゲーム機能、プレイヤー管理
- 失敗時: スクリーンショット・ビデオ取得

**ユニットテスト（Vitest）:**
- 対象: `src/utils/computeScore/`の全ファイル  
- モック: localStorage、fetch設定済み
- 環境: jsdom使用

## 必須遵守事項

### 言語・表記ルール

- **コミットメッセージ**: 必ず日本語で記述
- **コード内コメント**: 日本語で記述
- **エラーメッセージ**: 日本語で記述  
- **変数名・関数名**: 英語使用（既存コードに合わせる）
- **専門用語**: 競技クイズ用語を正確に使用

### 必須実行項目

1. **実装完了後**: `pnpm run lint`を必ず実行
2. **リントエラー**: コミット前に全て修正
3. **型エラー**: TypeScriptエラーは全て解決
4. **既存パターン**: 新規作成時は既存ファイルを参考にする

### 禁止事項

- `interface`の使用（`type`を使用）
- 実装後のlint実行忘れ
- 型定義なしのコード追加
- 既存の命名規則を無視したファイル作成

### 動作確認項目

実装後は以下を確認：
1. `pnpm run lint`でエラーなし
2. `pnpm run build`でビルド成功
3. 開発サーバーでの動作確認（`pnpm run dev`）
4. 関連する既存機能への影響なし

### CLAUDE.md更新ルール

プロジェクト全体に影響する新しいルールや設定が決まった場合：
- このファイルの該当セクションに具体的に記載
- 抽象的表現は避け、実行可能な形で記述
- 将来のClaude Codeセッションで再現可能な内容にする
