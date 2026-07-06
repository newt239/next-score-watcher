import type { NextConfig } from "next";

import { withSentryConfig } from "@sentry/nextjs";

import packageJson from "./package.json";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  env: {
    NEXT_PUBLIC_APP_VERSION: packageJson.version,
  },
  images: {
    formats: ["image/avif", "image/webp"],
  },
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
  webpack: {
    treeshake: {
      removeDebugLogging: true,
    },
    automaticVercelMonitors: true,
  },
});
