/** @type {import('next').NextConfig} */

const withPWA = require("next-pwa")({ dest: "public" });

const nextConfig = withPWA({
  pwa: {
    dest: "public",
    register: true,
    skipWaiting: true,
    disable: process.env.APP_ENV === "local",
  },
  reactStrictMode: false,
  swcMinify: true,
});

module.exports = nextConfig
