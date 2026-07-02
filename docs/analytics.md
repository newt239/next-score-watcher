# アクセス解析（GTM / GA4）設定手順

Score Watcher はユーザー行動の計測に Google Tag Manager（GTM）を利用しています。アプリからは各操作時にカスタムイベントを `dataLayer` へ送信しており、これを GTM 経由で Google Analytics 4（GA4）に転送することで「どの形式（rule）がよく利用されているか」などを可視化できます。

このドキュメントは、コード側の実装と、GA4 で形式別の集計・可視化を完成させるための GTM 管理画面での設定手順をまとめたものです。

## 前提

- `src/app/layout.tsx` で `@next/third-parties/google` の `GoogleTagManager` を読み込んでいます。**本番環境（`NODE_ENV === "production"`）でのみ有効**です。
- コンテナ ID は環境変数 `NEXT_PUBLIC_GA_ID` から渡しています（変数名は "GA" ですが、実体は GTM のコンテナ ID です）。
- イベント送信は `@next/third-parties/google` の `sendGTMEvent(data)` を使用しています。これは `dataLayer.push(data)` を行うもので、`{ event, <パラメータ> }` の形式でカスタムイベントとパラメータを送信します。

## アプリが送信するカスタムイベント一覧

`event` がイベント名、それ以外のキーがイベントに付随するパラメータ（データレイヤー変数）です。

| event 名                           | パラメータ      | 内容                           |
| ---------------------------------- | --------------- | ------------------------------ |
| `create_game`                      | `rule`          | ゲーム作成時の形式             |
| `copy_game`                        | `rule`          | ゲームコピー時の形式           |
| `export_game`                      | `rule`          | ゲームエクスポート時の形式     |
| `undo_log`                         | `rule`          | 操作の取り消し時の形式         |
| `switch_editable`                  | `rule`          | 手動編集モード切替時の形式     |
| `switch_fullscreen`                | `rule`          | 全画面表示切替時の形式         |
| `delete_game`                      | `game_id`       | 削除したゲームの ID            |
| `select_player_from_existing_game` | `game_id`       | 参照元ゲームの ID              |
| `select_quizset`                   | `quizset_name`  | 選択したクイズセット名         |
| `click_score_button`               | `button_color`  | スコアボタンの色               |
| `import_player`                    | `count`         | インポートしたプレイヤー件数   |
| `import_quiz`                      | `count`         | インポートしたクイズ件数       |
| `change_profile`                   | `profile_id`    | 切り替え先プロフィール ID      |
| `switch_dark_mode`                 | `theme`         | 切替後のテーマ（light / dark） |
| 設定変更系（`switch_*` ほか）      | `setting_value` | 変更後の設定値（文字列）       |

> **補足**: GA4 の `value` は数値型の予約パラメータのため、以前のように形式名などの文字列を `value` で送ると正しく集計できません。上記のように意味に応じたカスタムパラメータ名で送信しています。

## GTM 管理画面での設定手順

「どの形式がよく利用されているか」を可視化する例として `create_game` イベントの `rule` を GA4 に送る手順を示します。他イベントも同様の要領で設定できます。

### 1. データレイヤー変数の登録

1. GTM 管理画面 → 「変数」→ ユーザー定義変数の「新規」。
2. 変数タイプ「データレイヤーの変数」を選択。
3. データレイヤーの変数名に `rule` を入力（アプリが送るパラメータ名と一致させる）。
4. 変数名を「DLV - rule」などとして保存。
5. 他パラメータ（`game_id`, `quizset_name`, `button_color`, `count`, `profile_id`, `theme`, `setting_value`）も必要に応じて同様に登録。

### 2. カスタムイベントトリガーの作成

1. 「トリガー」→「新規」。
2. トリガータイプ「カスタムイベント」を選択。
3. イベント名に `create_game` を入力。
4. トリガー名を「CE - create_game」などとして保存。

### 3. GA4 イベントタグの作成

1. 「タグ」→「新規」。
2. タグタイプ「Google アナリティクス: GA4 イベント」を選択。
3. 測定 ID（GA4 の `G-XXXXXXX`）を設定。既に GA4 設定タグがある場合はそれを参照。
4. イベント名に `create_game` を入力。
5. 「イベントパラメータ」に以下を追加:
   - パラメータ名: `rule`
   - 値: `{{DLV - rule}}`（手順 1 で作成した変数）
6. トリガーに手順 2 の「CE - create_game」を紐付けて保存。

### 4. GA4 でカスタムディメンションを登録

1. GA4 管理画面 → 「データの表示」→「カスタム定義」→「カスタムディメンションを作成」。
2. ディメンション名: `rule`、範囲: イベント、イベントパラメータ: `rule`。
3. 保存。反映まで最大 24〜48 時間かかる場合があります。

### 5. 形式別の集計・可視化

1. GA4 →「探索」→「自由形式」レポートを作成。
2. ディメンションに `rule`、指標に「イベント数」を追加。
3. イベント名フィルタで `create_game` に絞り込む。
4. `rule` 別のイベント数が形式ごとの作成回数として集計・可視化されます。

## 動作確認

- 開発環境では GTM が読み込まれないため、送信確認は本番相当（`pnpm run build && pnpm run start` かつ `NEXT_PUBLIC_GA_ID` 設定済み）で行います。
- ブラウザ DevTools の Console で `window.dataLayer` を確認し、操作時に `{ event: "create_game", rule: "..." }` が push されることを確認します。
- GTM プレビューモード（Tag Assistant）で該当イベントの発火と `rule` 変数の値を確認できます。

## 補足: プライバシーポリシー

プライバシーポリシー（`src/app/(default)/docs/privacy_policy/page.tsx`）では「Google アナリティクス」と記載していますが、実体は GTM 経由での計測です。表記の見直しが必要になった場合はこの点に留意してください。
