# CLAUDE.md

このファイルは Claude Code (claude.ai/code) がこのリポジトリで作業する際のガイダンスを提供します。

## プロジェクト概要

Score Watcher は競技クイズのスコア可視化のための Next.js PWA で、17種類の異なるゲーム形式に対応しています。オフラインファーストアーキテクチャを特徴とし、ローカル IndexedDB ストレージとオプションの Supabase クラウド同期機能を提供します。

## 開発コマンド

### 基本的な開発
```bash
pnpm install          # 依存関係のインストール
pnpm run dev          # Turbo使用での開発サーバー起動
pnpm run build        # プロダクションビルド
pnpm run start        # プロダクションサーバー起動
```

### コード品質
```bash
pnpm run lint         # ESLint + Stylelint実行
pnpm run eslint       # JavaScript/TypeScript リントのみ
pnpm run stylelint    # CSS リント（自動修正付き）
pnpm run gen          # CSS Modules TypeScript定義生成
```

### テスト
```bash
pnpm run test         # Playwright E2E テスト（UI付き）実行
```

## アーキテクチャ

### データベース層
- **デュアルストレージ**: ローカル IndexedDB（Dexie.js経由）+ オプションの Supabase クラウド同期
- **コアテーブル**: `games`, `players`, `logs`, `quizes`
- **データベースユーティリティ**: `src/utils/db.ts` - データベース初期化とスキーマバージョニングを処理
- **型定義**: `src/utils/types.ts` - 全エンティティの包括的なTypeScript定義

### ゲームエンジン
- **スコア計算**: `src/utils/computeScore/` - 17のゲーム形式それぞれに対するモジュラーアルゴリズム
- **ゲーム形式**: 各形式（normal, nomx, ny等）が独自の計算ロジックを持つ
- **ゲーム状態**: ログシステムを通じて管理され、元に戻す/やり直し機能を実現

### UI アーキテクチャ
- **Mantine UI**: CSS Modules によるスタイリングを持つコンポーネントライブラリ
- **ルート構造**:
  - `(board)/` - ゲーム表示インターフェース（リアルタイムスコアボード）
  - `(default)/` - メインアプリページ（ゲーム、プレイヤー、クイズ管理）
- **PWA サポート**: サービスワーカーとオフライン機能

### 主要ユーティリティ
- `src/utils/functions.ts` - コアヘルパー関数
- `src/utils/rules.ts` - ゲームルール定義とメタデータ
- `src/utils/theme.ts` - Mantine テーマ設定
- `src/utils/supabase/` - 認証とクラウド同期統合

## 開発メモ

### TypeScript 設定
- `@/` から `src/` へのパスエイリアス設定
- 包括的な型定義による厳密な型付け
- 生成されたTypeScript定義を持つCSS Modules

### スタイリング
- PostCSS と Mantine プリセットによる CSS Modules
- Stylelint が recess-order によるプロパティ順序を強制
- モバイルレスポンシブデザインパターン

### テスト戦略
- 日本語ロケール（ja-JP）による Playwright E2E テスト
- ゲーム機能とプレイヤー管理に焦点を当てたテスト
- 失敗時のスクリーンショット/ビデオキャプチャ

### コード品質
- Next.js と TypeScript ルールによる ESLint
- フォーマッティングのための Prettier 統合
- インポート順序の強制

## 重要な注意事項

### 日本語での開発
- すべてのコミットメッセージは日本語で記述する
- コメントとエラーメッセージは日本語で記述する
- ユーザーとのやり取りは日本語で行う
- 競技クイズの専門用語と慣習に従う

### CLAUDE.md の更新について
- ユーザーとの対話中に生まれたプロジェクト全体に関する重要な指示や設定は、このCLAUDE.mdファイルに追記する
- 将来のClaude Codeインスタンスが同じガイドラインに従えるよう、学習した内容を文書化する
- 開発方針、コーディング規約、プロジェクト固有のルールなどは適切なセクションに整理して記録する