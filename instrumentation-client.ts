import * as Sentry from "@sentry/nextjs";

Sentry.init({
  enabled: process.env.NODE_ENV === "production",
  dsn: "https://7f2a3eb9428148c3a475c7b2c4bef92a@o4505277028433920.ingest.us.sentry.io/4505277040033792",
  tracesSampleRate: 1,
  debug: false,
  replaysOnErrorSampleRate: 1.0,
  replaysSessionSampleRate: 0.1,
  integrations: [
    Sentry.replayIntegration({
      maskAllText: true,
      blockAllMedia: true,
    }),
  ],
});

export const onRouterTransitionStart = Sentry.captureRouterTransitionStart;
