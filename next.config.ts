import type { NextConfig } from "next";

import { withSentryConfig } from "@sentry/nextjs";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  webpack: (config) => {
    config.infrastructureLogging = {
      level: "error",
    };

    // パフォーマンス警告を抑制
    config.performance = {
      hints: false,
    };

    return config;
  },
};

export default withSentryConfig(nextConfig, {
  org: "newt239",
  project: "score-watcher",
  silent: !process.env.CI,
  telemetry: false,
  widenClientFileUpload: true,
  tunnelRoute: "/monitoring",
  disableLogger: true,
  automaticVercelMonitors: true,
});
