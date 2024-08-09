import { withSentryConfig } from '@sentry/nextjs';
import nextPWA from "next-pwa";

/** @type {import('next').NextConfig} */

const withPWA = nextPWA({
  dest: 'public',
  register: true,
  skipWaiting: true,
  // ref: https://github.com/shadowwalker/next-pwa/issues/288#issuecomment-953799577
  runtimeCaching: [],
  buildExcludes: [/app-build-manifest\.json$/]
});

const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
};

export default withSentryConfig(withPWA(nextConfig), {
  org: "newt239",
  project: "score-watcher",
  silent: !process.env.CI,
  telemetry: false,
  widenClientFileUpload: true,
  tunnelRoute: "/monitoring",
  hideSourceMaps: true,
  disableLogger: true,
  automaticVercelMonitors: true,
});