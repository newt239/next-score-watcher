# Stripeサブスクリプション実装計画

本書は、Score Watcher に Stripe の Checkout を用いたサブスクリプション機能を導入するための実装計画である。オンライン機能における作成可能なゲーム数、プレイヤー数、問題数の上限、および観戦ページのレートリミットをプランごとに制御し、上限到達時にはユーザーへ明確なメッセージを表示する。既存の Next.js App Router と Hono ルーティング、Turso + Drizzle 構成を前提とし、API Routes で完結させる。Server Actions は使用しない。

## 目的と要件の整理

サブスクリプションの目的は、機能上限とレートリミットをプラン別に適用し、ユーザーが Stripe Checkout を通じて簡潔に契約・変更・解約できるようにすることである。必要な要件は、プラン定義と課金管理、ユーザーの契約状態の永続化、上限値の一貫適用、観戦ページのレートリミット適用、上限到達時のUI通知、Stripe Webhook による契約ライフサイクル反映の六点である。加えて、既存の作成系API（ゲーム・プレイヤー・問題）に対するガードの追加と、観戦データ取得APIに対するレート制御の追加が求められる。

## Stripe 連携の全体像

フロントエンドでは、プラン選択画面からプランコードを指定して Checkout セッション生成APIを呼び出し、Stripe のホストされた決済ページへ遷移させる。決済完了後は Stripe から Webhook が送られ、サブスクリプションの作成、更新、キャンセル、支払い失敗などのイベントが到達する。サーバーは Webhook を検証した上で、ユーザーの契約状態と紐づくサブスクリプションテーブルを更新し、現在有効なプランと課金期間を確定する。ユーザーは別途 Billing Portal のリンクからプラン変更や解約を行える。プランの上限は、この契約状態を単一の真実として参照し、API 層で常に評価される。

## データモデルと Drizzle スキーマ変更

プラン定義を静的な環境変数ではなくデータベースで管理して将来的な拡張に備える。必要な主なテーブルは三つである。第一に、プランを表す `plan` テーブルを作成し、コード、名称、説明、上限値、Stripe の product/price の識別子、公開状態、並び順などを保持する。第二に、ユーザーごとの契約状態を表す `user_subscription` テーブルを作成し、ユーザーID、現在のプランコード、Stripe の customer/subscription/price 識別子、サブスクリプションの状態、期間終了日時、キャンセル予定フラグ、作成・更新日時を保持する。第三に、観戦ページのレートリミット実装のため、`viewer_access` のような集約テーブルを用意し、ゲームID、IPアドレスのハッシュ、分単位のバケット、カウント、作成日時を保持し、一意制約で同一バケットの累計を更新する。IP の生データは保存せず、ハッシュ化してプライバシーに配慮する。既存の `game`, `player`, `quiz_question` はそのまま利用し、上限チェックのための集計クエリで参照する。Drizzle では `sqliteTable` と既存の命名規則に合わせ、`createdAt`, `updatedAt` は `integer(..., { mode: "timestamp" })` を用いる。プランコードは `plan.code` を主キーまたはユニークとして扱い、`user_subscription.planCode` と外部参照で結ぶ。状態は `active`, `trialing`, `incomplete`, `past_due`, `canceled`, `unpaid` など Stripe のステータスを保存する。

## 上限値の適用ポリシー

ゲーム、プレイヤー、問題の上限はユーザー単位で評価する。作成系の API コントローラー（`game/post-create.ts`, `player/post-create.ts`, `quiz/post-create.ts`）に、実行前のガードとして現在の件数を計測し、プランの上限に達している場合は 403 を返す。レスポンスは統一してエラーコードと人間可読なメッセージを含め、フロントがそのまま表示できるようにする。バルク作成では、作成予定件数を考慮して閾値を超えるかを事前に判定する。更新や削除は制限対象外とし、作成のみを制限する。観戦ページのレートリミットはゲームの `userId` からオーナーを特定し、そのユーザーのプランに応じた 1 分あたりのリクエスト上限で制御する。API は `429 Too Many Requests` を返し、再試行可能な残り時間をヘッダーで示すことを検討する。

## API 設計と実装ポイント

Stripe 連携のために、`/api/stripe/create-checkout-session` と `/api/stripe/portal` を追加し、プランコードを受け取って Checkout セッションURLやポータルURLを生成して返す。これらはサーバーのみで Stripe のシークレットキーを利用する。Webhook は `/api/stripe/webhook` を追加し、署名検証を行った上で `user_subscription` を状態遷移に応じて更新する。状態は `price` の変更に追随できるように `stripePriceId` と `planCode` を突き合わせる。併せて `/api/subscription/get-status` を追加して、サーバー側レンダリング時に `createApiClientOnServer()` から現在の契約状態と上限値を取得できるようにする。既存の作成系 API では、ハンドラーの先頭で契約状態の取得と上限チェックを行い、制限超過時には早期にエラーを返す。観戦データの取得エンドポイントでは、`viewer_access` を分バケットで `INSERT ... ON CONFLICT DO UPDATE` 相当の操作によりカウントアップし、閾値を超えた場合に 429 を返す。

## フロントエンドの改修

プラン選択画面を `/online/` 配下に追加し、プランの説明と現在の契約状態、遷移先の Checkout ボタン、Billing Portal リンクを提供する。管理画面の作成ボタン群には `useTransition` を用いたローディング制御を加え、API から `PLAN_LIMIT_REACHED` のようなコードで 403 が返った場合に Mantine の通知コンポーネントで上限到達のメッセージを表示し、アップグレード動線へ誘導する。観戦ページのレートリミット超過時は、閲覧ユーザーに対して待機や再読み込みの案内を表示する。初期データの取得は既存ルールに従いサーバーコンポーネントで行い、API クライアントは Hono クライアントを利用する。

## 環境変数と設定

Stripe のシークレットキー、Publishable キー、Webhook シークレット、価格IDなどを `.env` に追加する。価格IDは管理を容易にするために `plan` テーブルにも保存し、環境変数は初期投入と検証に用いる。必要な主なキーは `STRIPE_SECRET_KEY`, `STRIPE_PUBLISHABLE_KEY`, `STRIPE_WEBHOOK_SECRET`, 各プランの `PRICE_ID` 群である。Turso の接続情報は既存の `drizzle.config.ts` と `DBClient` を引き続き利用する。

## Webhook の取り扱いと整合性

Webhook では署名検証を必須とし、受信イベントは冪等処理を意識して `user_subscription` を更新する。`customer.subscription.created/updated/deleted`, `invoice.payment_succeeded/failed`, `checkout.session.completed` など主要イベントを取り扱う。ユーザーの `stripeCustomerId` が未登録の場合には初回イベントで紐付けを作成する。イベント処理の失敗はログに記録し、必要に応じてリトライ可能にする。Webhook ハンドラーは `factory.createHandlers` に従って実装し、`zValidator` による最低限のバリデーションと署名検証後の型安全な処理を行う。

## マイグレーションと初期データ投入

`src/utils/drizzle/schema` に `billing.ts` を新設し、`plan`, `user_subscription`, `viewer_access` を定義する。`drizzle.config.ts` のスキーマ参照は既存の `index.ts` で一括エクスポートするだけでよい。マイグレーションは `pnpm run db:generate` と `pnpm run db:push` で作成・適用する。初期データとして、Free/Pro/Business などのプラン行を `plan` に投入するシード処理を追加し、各プランに上限値と `stripePriceId` を紐付ける。既存ユーザーには `user_subscription` に Free プランを暗黙的に割り当てるか、参照時に未契約なら Free 相当として扱うロジックを実装する。

## 上限到達時のメッセージ方針

API は上限超過時に 403 を返し、ボディにはコード、タイトル、説明、改善アクション（例：アップグレードURL）を含める。フロントはこの情報をそのまま通知に表示する。観戦ページのレート超過は 429 とし、待機時間目安をテキストで提示する。文言は日本語で統一し、可読性と操作誘導を重視する。UI 実装では Mantine の Notification または Modal を用い、ボタンに `disabled` を設定して連打を防止する。

## 実装手順の段階的計画

第一段階として、Drizzle スキーマとマイグレーション、初期プラン投入、`/api/subscription/get-status` の最小実装を行い、サーバーサイドで現在プランを取得できる状態にする。第二段階で、作成系 API への上限ガードを実装してエラー応答形式を統一する。第三段階で、観戦ページ向けのレートリミットを導入し、`viewer_access` による分バケット集約で制御する。第四段階で、Stripe の Checkout セッション生成、Billing Portal、Webhook を導入し、契約状態の更新を自動化する。第五段階で、フロントエンドのプラン画面と上限到達時の通知表示を整備し、サーバーコンポーネント経由の初期データ受け渡しを仕上げる。最終段階で、E2E とユニットテストで上限到達とレート超過の挙動を検証し、ログと監視を整える。

## 影響範囲と更新が必要な箇所一覧

Drizzle スキーマに `billing.ts` を追加し、`schema/index.ts` にエクスポートを加える。`src/server/controllers` には `subscription` と `stripe` のディレクトリを追加し、Checkout/Portal/Webhook/Status の各ハンドラーを実装する。`src/server/repositories` には `subscription.ts` と `viewer.ts` を追加し、契約状態の取得・更新と観戦レート集約を実装する。既存の `game/post-create.ts`, `player/post-create.ts`, `quiz/post-create.ts` に上限ガードを入れる。`src/models` には `subscription.ts` と `stripe.ts` を追加し、プランコード、API リクエスト・レスポンス、Webhook ペイロードの Zod スキーマを定義する。フロントエンドでは `/online/subscription` などにプラン画面を追加し、API クライアントで Checkout/Portal を呼び出す。観戦APIのハンドラーではレートリミットを適用し、HTTP 429 を返す分岐を加える。

## セキュリティとプライバシー

Webhook の署名検証は必須であり、機密鍵はサーバー環境変数で厳格に管理する。観戦レート制御で扱うクライアント識別子は平文のIPを保持せず、ハッシュ化して保存する。プランと価格の対応はサーバー管理とし、クライアント側に価格IDを露出しない。全てのログは個人情報を含まない形式で記録する。

## テスト戦略と移行

単体テストでは、上限判定関数、観戦レート集約ロジック、Webhook ステートマシンの主要分岐を検証する。E2E では Free プランでの作成制限発火と Pro プランでの成功パス、観戦のレート制限の動作を確認する。移行時には既存ユーザーに対して Free 相当の挙動が保証されるようにし、運用を通じて `plan` の値を調整できる体制を整える。これにより、プランの追加や上限の改定にも柔軟に対応できる。
