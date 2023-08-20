import React from "react";
import ReactDOM from "react-dom/client";

import * as Sentry from "@sentry/react";

import App from "#/App";
import { initializeGA4 } from "#/utils/ga4";

if (process.env.NODE_ENV === "production") {
  Sentry.init({
    dsn: "https://7f2a3eb9428148c3a475c7b2c4bef92a@o4505277028433920.ingest.sentry.io/4505277040033792",
    release: import.meta.env.VITE_APP_VERSION,
    integrations: [
      new Sentry.BrowserTracing({
        tracePropagationTargets: ["https://score-watcher.newt239.dev/"],
      }),
      new Sentry.Replay(),
    ],
    environment: process.env.NODE_ENV,
    tracesSampleRate: 1.0,
    replaysSessionSampleRate: 0.1,
    replaysOnErrorSampleRate: 1.0,
  });
}

initializeGA4();

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
