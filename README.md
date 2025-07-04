# next-score-watcher

![version](https://img.shields.io/github/package-json/v/newt239/next-score-watcher?style=flat)

<img
  src="https://raw.githubusercontent.com/newt239/next-score-watcher/main/public/score-watcher-ogp.webp" 
  alt="Score Watcher アイキャッチ画像"
/>

競技クイズにおけるプレイヤーの得点状況を可視化するための Web アプリケーションです。

現在 17 の形式に対応しており、スコアの表示や勝ち抜け / 敗退の情報だけでなく、問題文表示やスマートフォンでの表示も可能です。

https://score-watcher.com/

## 利用に当たって

- 本アプリケーションは**非営利目的である限り**どなたでも自由に利用することができます。
  - 詳細は [商用利用に関するルール](https://score-watcher.com/docs/for_commercial_use)をご確認ください。
- オープン大会等で利用される際は、[@newt239](https://twitter.com/newt239) までご報告をお願いします。
- この他機能リクエストや不具合の報告等についても Twitter や GitHub の Issue より受け付けます。

## ローカル環境での起動

### 起動に必要なもの

- Node.js (v22 以降)
- pnpm

### 環境変数

```env
NEXT_PUBLIC_APP_VERSION=
NEXT_PUBLIC_GA_ID=
NEXT_PUBLIC_TAG_ID=
NEXT_PUBLIC_SENTRY_DSN=
SENTRY_AUTH_TOKEN=
```

### 起動方法

#### 1. 以下のコマンドを実行

```bash
pnpm intstall
pnpm run dev
```

#### 2. ブラウザでアクセス

デフォルトではポート番号 3000 で起動します。

http://localhost:3000/

### テスト

```bash
pnpm run test
```
