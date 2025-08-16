# Stripeサブスクリプション実装計画

本書は、Score Watcher に Stripe の Checkout を用いたサブスクリプション機能を導入するための実装計画である。オンライン機能における作成可能なゲーム数、プレイヤー数、問題数の上限、および観戦ページのレートリミットをプランごとに制御し、上限到達時にはユーザーへ明確なメッセージを表示する。既存の Next.js App Router と Hono ルーティング、Turso + Drizzle 構成を前提とし、API Routes で完結させる。Server Actions は使用しない。

本計画は以下のプロダクト方針を反映する：

- プランは「free」と「plus」の2種類。デフォルトは「free」。
- プラン上限値はコードにハードコードして管理する（DBにプランテーブルは作成しない）。
- Stripe の Product ID は環境変数で管理し、週払い・月払いの2種の価格を扱う（価格IDは Product に紐づく Price を Stripe API から取得して選択する）。
- 観戦ページのレートリミット集計は Cloudflare KV を使用する（DBテーブルは作成しない）。

プラン別の上限値は次の通りである。free は game 10、player 50、quiz 200、観戦レート 1 分あたり 60。plus は game 100、player 500、quiz 2000、観戦レート 1 分あたり 1000。作成上限はユーザー単位で評価し、観戦レートはゲームの所有者のプランを参照する。

## 目的と要件の整理

サブスクリプションの目的は、機能上限とレートリミットをプラン別に適用し、ユーザーが Stripe Checkout を通じて簡潔に契約・変更・解約できるようにすることである。必要な要件は、プラン定義と課金管理、ユーザーの契約状態の永続化、上限値の一貫適用、観戦ページのレートリミット適用、上限到達時のUI通知、Stripe Webhook による契約ライフサイクル反映の六点である。加えて、既存の作成系API（ゲーム・プレイヤー・問題）に対するガードの追加と、観戦データ取得APIに対するレート制御の追加が求められる。

## Stripe 連携の全体像

フロントエンドでは、プラン選択画面からプランコードを指定して Checkout セッション生成APIを呼び出し、Stripe のホストされた決済ページへ遷移させる。決済完了後は Stripe から Webhook が送られ、サブスクリプションの作成、更新、キャンセル、支払い失敗などのイベントが到達する。サーバーは Webhook を検証した上で、ユーザーの契約状態と紐づくサブスクリプションテーブルを更新し、現在有効なプランと課金期間を確定する。ユーザーは別途 Billing Portal のリンクからプラン変更や解約を行える。プランの上限は、この契約状態を単一の真実として参照し、API 層で常に評価される。

## データモデルと Drizzle スキーマ変更

プランは DB で管理せずコードにハードコードする。DB に追加が必要なのは、ユーザーごとの契約状態を表す `user_subscription` テーブルのみである。`user_subscription` ではユーザーID、現在のプランコード（`free`/`plus`）、Stripe の customer/subscription/price 識別子、サブスクリプション状態、期間終了日時、キャンセル予定フラグ、作成・更新日時を保持する。既存の `game`, `player`, `quiz_question` はそのまま利用し、上限チェックのための集計クエリで参照する。Drizzle では既存の命名規則に合わせ、`integer(..., { mode: "timestamp" })` で `createdAt`/`updatedAt` を表現する。

観戦ページのレートリミットは DB テーブルを使用せず Cloudflare KV を利用する。キーは `vr:${gameId}:${ipHash}:${yyyymmddHHmm}` のような構成とし、値は現在のカウント（文字列数値）を保持する。TTL を短め（例: 120 秒）に設定し、1 分バケットの期間を少し超えて自然消滅させる。増分操作は厳密な原子性が不要なため、読み取り→加算→保存の簡易パスで実装し、多少の競合による誤差を許容する。厳密性が必要になった場合は Durable Objects などへの移行を検討する。

free プランでの観戦レートは 1 分あたり 60、plus プランは 1 分あたり 1000 とする。超過時は 429 を返し、推奨待機秒をレスポンスに含める。

## 上限値の適用ポリシー

ゲーム、プレイヤー、問題の上限はユーザー単位で評価する。作成系の API コントローラー（`game/post-create.ts`, `player/post-create.ts`, `quiz/post-create.ts`）に、実行前のガードとして現在の件数を計測し、プランの上限に達している場合は 403 を返す。レスポンスは統一してエラーコードと人間可読なメッセージを含め、フロントがそのまま表示できるようにする。バルク作成では、作成予定件数を考慮して閾値を超えるかを事前に判定する。更新や削除は制限対象外とし、作成のみを制限する。観戦ページのレートリミットはゲームの `userId` からオーナーを特定し、そのユーザーのプランに応じた 1 分あたりのリクエスト上限で制御する。API は `429 Too Many Requests` を返し、再試行可能な残り時間をヘッダーで示すことを検討する。

## API 設計と実装ポイント

Stripe 連携のために、`/api/stripe/create-checkout-session` と `/api/stripe/portal` を追加し、プランコードと課金間隔（`week`/`month`）を受け取って Checkout セッションURLやポータルURLを生成して返す。Checkout の価格指定は、環境変数の Product ID から Stripe API で該当 Product の Price 一覧を取得し、`recurring.interval` が一致する Price を選択する（週払い/月払いの両対応）。Webhook は `/api/stripe/webhook` を追加し、署名検証を行った上で `user_subscription` を状態遷移に応じて更新する。状態は `price` の変更に追随できるように `stripePriceId` から内部プランコード（`free`/`plus`）を解決する。併せて `/api/subscription/get-status` を追加して、サーバー側レンダリング時に `createApiClientOnServer()` から現在の契約状態と上限値を取得できるようにする。既存の作成系 API では、ハンドラーの先頭で契約状態の取得と上限チェックを行い、制限超過時には早期にエラーを返す。観戦データの取得エンドポイントでは、Cloudflare KV の分バケットでカウントアップし、閾値を超えた場合に 429 を返す。

## フロントエンドの改修

プラン選択画面を `/online/` 配下に追加し、プランの説明（free/plus）と現在の契約状態、課金間隔を選べる Checkout ボタン、Billing Portal リンクを提供する。管理画面の作成ボタン群には `useTransition` を用いたローディング制御を加え、API から `PLAN_LIMIT_REACHED` のようなコードで 403 が返った場合に Mantine の通知コンポーネントで上限到達のメッセージを表示し、アップグレード動線へ誘導する。観戦ページのレートリミット超過時は、閲覧ユーザーに対して待機や再読み込みの案内を表示する。初期データの取得は既存ルールに従いサーバーコンポーネントで行い、API クライアントは Hono クライアントを利用する。

## 環境変数と設定

Stripe のシークレットキー、Publishable キー、Webhook シークレット、各プランの Product ID を `.env` に追加する。Checkout 時の価格指定は Product に紐づく Price を API で列挙して interval で選択するため、Price ID を環境変数には持たない前提とする。必要な主なキーは `STRIPE_SECRET_KEY`, `STRIPE_PUBLISHABLE_KEY`, `STRIPE_WEBHOOK_SECRET`, `STRIPE_PRODUCT_FREE`, `STRIPE_PRODUCT_PLUS` である（free は請求を発生させないダミー Product でもよい）。観戦レート用に Cloudflare KV の REST アクセス情報（`CF_ACCOUNT_ID`, `CF_API_TOKEN`, `CF_KV_NAMESPACE_ID`）を追加する。Turso の接続情報は既存の `drizzle.config.ts` と `DBClient` を引き続き利用する。

## Webhook の取り扱いと整合性

Webhook では署名検証を必須とし、受信イベントは冪等処理を意識して `user_subscription` を更新する。`customer.subscription.created/updated/deleted`, `invoice.payment_succeeded/failed`, `checkout.session.completed` など主要イベントを取り扱う。ユーザーの `stripeCustomerId` が未登録の場合には初回イベントで紐付けを作成する。`price.product` から内部プランコード（`free`/`plus`）を解決するマッピングを実装し、週払い/月払いいずれも同一プランとして扱う。イベント処理の失敗はログに記録し、必要に応じてリトライ可能にする。Webhook ハンドラーは `factory.createHandlers` に従って実装し、`zValidator` による最低限のバリデーションと署名検証後の型安全な処理を行う。

## マイグレーションと初期データ投入

`src/utils/drizzle/schema` に `billing.ts` を新設し、`user_subscription` を定義する（`plan` と `viewer_access` は作成しない）。`drizzle.config.ts` のスキーマ参照は既存の `index.ts` で一括エクスポートするだけでよい。マイグレーションは `pnpm run db:generate` と `pnpm run db:push` で作成・適用する。初期データ投入は不要だが、参照時に `user_subscription` が存在しなければ Free 相当で扱う実装を行う。

## 上限到達時のメッセージ方針

API は上限超過時に 403 を返し、ボディにはコード、タイトル、説明、改善アクション（例：アップグレードURL）を含める。フロントはこの情報をそのまま通知に表示する。観戦ページのレート超過は 429 とし、待機時間目安をテキストで提示する。文言は日本語で統一し、可読性と操作誘導を重視する。UI 実装では Mantine の Notification または Modal を用い、ボタンに `disabled` を設定して連打を防止する。

## 実装手順の段階的計画

第一段階として、Drizzle スキーマとマイグレーション（`user_subscription` のみ）と `/api/subscription/get-status` の最小実装を行い、サーバーサイドで現在プランを取得できる状態にする。第二段階で、作成系 API への上限ガードを実装してエラー応答形式を統一する。第三段階で、観戦ページ向けのレートリミットを Cloudflare KV に導入し、分バケット集約で制御する。第四段階で、Stripe の Checkout セッション生成（Product→Price 解決）、Billing Portal、Webhook を導入し、契約状態の更新を自動化する。第五段階で、フロントエンドのプラン画面と上限到達時の通知表示を整備し、サーバーコンポーネント経由の初期データ受け渡しを仕上げる。最終段階で、E2E とユニットテストで上限到達とレート超過の挙動を検証し、ログと監視を整える。

## 影響範囲と更新が必要な箇所一覧

Drizzle スキーマに `billing.ts` を追加し、`schema/index.ts` にエクスポートを加える（`user_subscription` のみ）。`src/server/controllers` には `subscription` と `stripe` のディレクトリを追加し、Checkout/Portal/Webhook/Status の各ハンドラーを実装する。`src/server/repositories` には `subscription.ts` を追加し、契約状態の取得・更新を実装する。観戦レート集約は Cloudflare KV にアクセスする `src/server/repositories/viewer-rate.ts` を追加する。既存の `game/post-create.ts`, `player/post-create.ts`, `quiz/post-create.ts` に上限ガードを入れる。`src/models` には `subscription.ts` と `stripe.ts` を追加し、プランコード、API リクエスト・レスポンス、Webhook ペイロードの Zod スキーマを定義する。フロントエンドでは `/online/subscription` などにプラン画面を追加し、API クライアントで Checkout/Portal を呼び出す。観戦APIのハンドラーではレートリミットを適用し、HTTP 429 を返す分岐を加える。

## ハードコードするプラン設定の配置と使用方針

プラン設定は `src/server/utils/subscription/config.ts` にハードコードする。内容はプランコード（`free`/`plus`）、各上限値（game、player、quiz、viewerRateLimitPerMinute）、Stripe の Product ID 対応を保持する。サーバー側のいずれのコントローラーからもこの設定を参照し、API レスポンスに上限値を含めて返す。環境変数は Product ID のみを保持し、Price は Checkout 時に interval から解決する。

## 解約後の表示仕様（ダウングレード時の可視性）

有料プラン（plus）を契約後に解約して free に戻った場合、保存データは削除しないが、上限を超える部分は表示しない。リスト系APIでは totalCount と visibleCount を返し、visibleCount は上限値までに制限してデータを返す。作成系APIは free の上限に達している場合は 403 で拒否する。ユーザーが再度 plus を契約すれば、上限超過分の表示が自動的に復帰する。観戦レートは free の閾値 60/分が適用される。

## セキュリティとプライバシー

Webhook の署名検証は必須であり、機密鍵はサーバー環境変数で厳格に管理する。観戦レート制御で扱うクライアント識別子は平文のIPを保持せず、ハッシュ化して保存する。プランと価格の対応はサーバー管理とし、クライアント側に価格IDを露出しない。全てのログは個人情報を含まない形式で記録する。

## テスト戦略と移行

単体テストでは、上限判定関数、観戦レート集約ロジック、Webhook ステートマシンの主要分岐を検証する。E2E では Free プランでの作成制限発火と Pro プランでの成功パス、観戦のレート制限の動作を確認する。移行時には既存ユーザーに対して Free 相当の挙動が保証されるようにし、運用を通じて `plan` の値を調整できる体制を整える。これにより、プランの追加や上限の改定にも柔軟に対応できる。
