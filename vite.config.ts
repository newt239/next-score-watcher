import { sentryVitePlugin } from "@sentry/vite-plugin";
import react from "@vitejs/plugin-react-swc";
import * as path from "path";
import { defineConfig } from "vite";
import { VitePWA } from "vite-plugin-pwa";

// https://vitejs.dev/config/
export default defineConfig(() => {
  return {
    build: {
      sourcemap: true,
    },
    plugins: [
      react(),
      VitePWA({
        registerType: "autoUpdate",
      }),
      process.env.NODE_ENV === "production" &&
        sentryVitePlugin({
          authToken: process.env.SENTRY_AUTH_TOKEN,
          org: "newt239",
          project: "score-watcher",
        }),
    ],
    resolve: {
      alias: {
        "~": path.resolve(__dirname, "src"),
        "@panda": path.resolve(__dirname, "styled-system"),
      },
    },
  };
});
