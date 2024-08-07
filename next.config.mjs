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
  // For all available options, see:
  // https://github.com/getsentry/sentry-webpack-plugin#options

  org: "newt239",
  project: "score-watcher",

  // Only print logs for uploading source maps in CI
  silent: !process.env.CI,

  // For all available options, see:
  // https://docs.sentry.io/platforms/javascript/guides/nextjs/manual-setup/
  telemetry: false,

  // IconUpload a larger set of source maps for prettier stack traces (increases build time)
  widenClientFileUpload: true,

  // Route browser requests to Sentry through a Next.js rewrite to circumvent ad-blockers.
  // This can increase your server load as well as your hosting bill.
  // Note: IconCheck that the configured route will not match with your Next.js middleware, otherwise reporting of client-
  // side errors will fail.
  tunnelRoute: "/monitoring",

  // Hides source maps from generated client bundles
  hideSourceMaps: true,

  // Automatically tree-shake Sentry logger statements to reduce bundle size
  disableLogger: true,

  // Enables automatic instrumentation of Vercel Cron Monitors. (Does not yet work with App Router route handlers.)
  // See the following for more information:
  // https://docs.sentry.io/product/crons/
  // https://vercel.com/docs/cron-jobs
  automaticVercelMonitors: true,
});