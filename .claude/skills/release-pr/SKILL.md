---
name: release-pr
description: develop → main のリリースPRを作成する。新バージョン番号の決定、CHANGELOG.md / src/utils/changelog.ts / package.json のバージョン更新、アップデートモーダル用メッセージの作成、タグの作成、gh CLI での PR 作成までを一連で行い、マージ後に GitHub リリース (minor 以上のみ) を作成する。「リリース準備」「リリースPRを作って」などと言われたときに起動する。
---

# release-pr

Score Watcher の `develop` ブランチを `main` にマージするためのリリース PR を作成する skill。

## 適用条件

- 現在のブランチが `develop` であること。それ以外の場合は「一度 develop に切り替えるか、リリース用ブランチを develop から派生してください」と促す。
- `origin` に GitHub リポジトリがあり、`gh` CLI がログイン済みであること (`gh auth status` で確認)。
- 作業ツリーがクリーンであること。未コミットの変更がある場合はユーザーに扱いを確認する。

## 手順

以下は順序通りに実行する。ユーザーとの対話が必要な箇所は AskUserQuestion / 直接の質問で必ずユーザーに確認を取る。

### 1. 前提の確認

- `git status` で作業ツリーがクリーンなことを確認
- `git branch --show-current` が `develop` かを確認 (違う場合は中止)
- `git log --oneline origin/main..HEAD` で main との差分コミットを一覧化し、内容の概要を把握
- `package.json` の `version` を読み取り、現在のバージョンを控える

### 2. 新バージョンの決定

現在のバージョンを提示したうえで、ユーザーに次のいずれかを AskUserQuestion で確認する。

- `patch` (例: 3.4.0 → 3.4.1) — 不具合修正のみ
- `minor` (例: 3.4.0 → 3.5.0) — 新機能追加
- `major` (例: 3.4.0 → 4.0.0) — 破壊的変更
- 手動入力 — ユーザーが直接指定

ユーザーの回答に基づいて新バージョン文字列を決定する。

### 3. リリース内容のヒアリング

`git log --oneline origin/main..HEAD` の結果をもとに、以下を分類してユーザーに提示し、修正・追加を求める。

- `news` (お知らせ、任意)
- `features` (新機能、任意)
- `improvements` (改善、任意)
- `fixes` (不具合修正、任意)
- `others` (その他、任意)

**必ずユーザーに草案を見せて確認を取る**。適当に自動生成して確定してはならない。文面はユーザーが承認したものだけを採用する。

各項目は 1 行 40 文字目安、末尾に句読点は付けない (既存の CHANGELOG.md / changelog.ts の文体に合わせる)。

### 4. ファイル更新

以下ファイルをまとめて更新する。既存のフォーマットを崩さないこと。

#### 4.1 `package.json`

- `version` を新バージョンに更新
- この値は `next.config.ts` の `env` オプション経由で `NEXT_PUBLIC_APP_VERSION` としてビルド時に注入される (他に更新すべき環境変数はない)

#### 4.2 `CHANGELOG.md`

先頭に次の形式で追記する。日付は `YYYY/MM/DD` 形式。

```markdown
# v<新バージョン> - <YYYY/MM/DD>

- [feat] ...
- [improve] ...
- [fix] ...
- [chore] ...
```

prefix は次の通りマッピングする。

- `features` → `[feat]`
- `improvements` → `[improve]`
- `fixes` → `[fix]`
- `others` → `[chore]` (依存関係の更新など) / `[style]` (UI微調整) / `[docs]` (ドキュメント) をユーザーと相談して選択

`news` を書いた場合は箇条書きの上に段落として追加する。

#### 4.3 `src/utils/changelog.ts`

`changelog` 配列の先頭に新エントリを差し込む。date は `YYYY-MM-DD` 形式。

```typescript
{
  version: "<新バージョン>",
  date: "<YYYY-MM-DD>",
  news: "<省略可>",
  features: [
    "...",
  ],
  improvements: [
    "...",
  ],
  fixes: [
    "...",
  ],
  others: [
    "...",
  ],
},
```

- 内容が空のセクションはキーごと省略する (`features: []` は書かない)
- モーダル (`src/app/_components/UpdateModal/UpdateModal.tsx`) は**同一マイナー系列 (major.minor が一致する) のエントリをまとめて表示する**。patch リリースでは patch エントリの fixes と直近 minor の features / improvements が合わせて表示されるため、patch エントリに minor の内容を書き写す必要はない
- `news` は系列内で最初に見つかったもの (配列の先頭側 = 最新優先) が表示される
- **ユーザーへの恒常的な案内 (例: Googleフォームで要望・不具合報告を常時受け付けている旨) はモーダルに恒常セクションを追加せず、`news` 欄に記載する**
- **ユーザーに関係のない変更はこのファイルに載せない**。依存関係の更新・CI 調整・内部リファクタリング・アップデートモーダル自体の表示調整などは CHANGELOG.md のみに記載し、changelog.ts (= アップデートモーダル) からは除外する

### 5. 品質チェック

以下を実行し、エラーが出たら修正する。

```bash
npx tsc --noEmit && pnpm run lint:fix
```

### 6. コミット

リリース準備コミットのメッセージは、過去のリリースコミットの慣習に従い `update: v<新バージョン>` とする (例: `update: v3.3.0`)。

```bash
git add package.json CHANGELOG.md src/utils/changelog.ts
git commit -m "update: v<新バージョン>"
```

### 7. タグの作成 (PR 作成前)

すべてのリリース (patch / minor / major) で、develop 上のリリース準備コミットに `v<新バージョン>` 形式のタグを付与する。

```bash
git tag v<新バージョン>
```

### 8. プッシュと PR 作成

ブランチとタグをまとめてプッシュする。

```bash
git push -u origin <現在のブランチ>
git push origin v<新バージョン>
```

`gh pr create` で `main` 宛の PR を作成する。タイトル・本文は日本語。

- Base: `main`
- Head: 現在のブランチ (通常は `develop`)
- タイトル: `release: v<新バージョン>` (直近のリリース PR の慣習に合わせる)
- 本文: 以下テンプレート

```markdown
## 概要

v<新バージョン> のリリース PR です。

## 変更内容

<CHANGELOG.md に追記した箇条書きをそのまま貼り付け>

## 動作確認

- [ ] トップページのバージョン表示が更新されていること
- [ ] アップデートモーダルが新バージョンで開くこと
- [ ] `/changelog` の履歴に新バージョンが表示されること
```

PR URL をユーザーに提示し、マージを待つ。

### 9. GitHub リリースの作成 (PR マージ後、minor 以上のみ)

PR がマージされたことをユーザーから伝えられたら (または `gh pr view <PR番号> --json state` で MERGED を確認したら)、GitHub リリースを作成する。

**GitHub リリースは minor 以上 (minor / major) の場合のみ作成する**。patch リリースではタグのみ (手順 7 で作成済み) とし、GitHub リリースは作成しない。

```bash
gh release create v<新バージョン> --title "v<新バージョン>" --notes "<リリースノート>"
```

- タグは手順 7 で作成・プッシュ済みのものを使用する (`--target` は指定しない)
- リリースノートは CHANGELOG.md に追記した箇条書きをそのまま使う (`news` があれば冒頭に段落として含める)

リリース URL をユーザーに提示して完了。

## 注意事項

- **勝手にバージョンを決めない**。必ずユーザーに patch / minor / major を確認する
- **勝手にリリースノートを書き切らない**。草案を見せて承認を得る
- **他のブランチにコミットしない**。develop 以外にいる場合は必ず中止
- **main へは push しない**。PR 経由でのみマージする
- **PR のマージは行わない**。マージはユーザーが行い、マージ確認後に GitHub リリース作成へ進む
- **タグは develop 上で PR 作成前に作成する**。`v<新バージョン>` 形式 (タグのみ v プレフィックスを付ける)
- **GitHub リリースは minor 以上のみ作成する**。patch はタグのみ
- **changelog.ts (アップデートモーダル) にユーザーに関係のない変更を載せない**。内部変更は CHANGELOG.md のみに記載する
- リリース準備コミットは `update: v<新バージョン>`、PR タイトルは `release: v<新バージョン>` (過去のリリースの慣習)
- 既存の CHANGELOG.md / changelog.ts の文体・prefix 慣習を必ず踏襲する
- 変更対象のバージョン文字列にプレフィックス (v, V) を付けない (package.json の慣習)
