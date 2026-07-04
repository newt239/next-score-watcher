import * as Sentry from "@sentry/nextjs";

Sentry.init({
  enabled: process.env.NODE_ENV === "production",
  dsn: "https://7f2a3eb9428148c3a475c7b2c4bef92a@o4505277028433920.ingest.us.sentry.io/4505277040033792",
  tracesSampleRate: 0.1,
  debug: false,
  replaysOnErrorSampleRate: 1.0,
  replaysSessionSampleRate: 0.1,
  ignoreErrors: [
    // Adobe Fonts(typekit)のフォント取得失敗。回線不安定時に発生する外部起因エラー
    /use\.typekit\.net/,
    // ブラウザ拡張が注入するサードパーティスクリプト起因のエラー
    /MktoForms2 is not defined/,
    /admiss\.info/,
  ],
  denyUrls: [
    // ブラウザ拡張由来のエラーを除外
    /^chrome-extension:\/\//,
    /^moz-extension:\/\//,
    /^safari(-web)?-extension:\/\//,
  ],
  integrations: [
    // import/namespaceルールでは型定義に存在しないプロパティアクセスとして警告されるため無効化
    // ランタイムでは問題なく動作することを確認済み
    // eslint-disable-next-line import/namespace
    Sentry.replayIntegration({
      maskAllText: true,
      blockAllMedia: true,
    }),
  ],
});

// eslint-disable-next-line import/namespace
export const onRouterTransitionStart = Sentry.captureRouterTransitionStart;
