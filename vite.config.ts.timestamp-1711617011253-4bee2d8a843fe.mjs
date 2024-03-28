// vite.config.ts
import { sentryVitePlugin } from "file:///C:/Users/ff192/Documents/newt/next-score-watcher/node_modules/.pnpm/@sentry+vite-plugin@2.16.0/node_modules/@sentry/vite-plugin/dist/esm/index.mjs";
import react from "file:///C:/Users/ff192/Documents/newt/next-score-watcher/node_modules/.pnpm/@vitejs+plugin-react-swc@3.6.0_vite@4.5.3/node_modules/@vitejs/plugin-react-swc/index.mjs";
import * as path from "path";
import { defineConfig } from "file:///C:/Users/ff192/Documents/newt/next-score-watcher/node_modules/.pnpm/vite@4.5.3_@types+node@18.19.26/node_modules/vite/dist/node/index.js";
import { VitePWA } from "file:///C:/Users/ff192/Documents/newt/next-score-watcher/node_modules/.pnpm/vite-plugin-pwa@0.16.7_vite@4.5.3_workbox-build@7.0.0_workbox-window@7.0.0/node_modules/vite-plugin-pwa/dist/index.js";
import tsconfigPaths from "file:///C:/Users/ff192/Documents/newt/next-score-watcher/node_modules/.pnpm/vite-tsconfig-paths@4.3.2_typescript@5.4.3_vite@4.5.3/node_modules/vite-tsconfig-paths/dist/index.mjs";
var __vite_injected_original_dirname = "C:\\Users\\ff192\\Documents\\newt\\next-score-watcher";
var vite_config_default = defineConfig(() => {
  return {
    build: {
      sourcemap: true
    },
    plugins: [
      react(),
      tsconfigPaths({ root: "./" }),
      VitePWA({
        registerType: "autoUpdate"
      }),
      process.env.NODE_ENV === "production" && sentryVitePlugin({
        authToken: process.env.SENTRY_AUTH_TOKEN,
        org: "newt239",
        project: "score-watcher"
      })
    ],
    resolve: {
      alias: {
        "~": path.resolve(__vite_injected_original_dirname, "src"),
        "@panda": path.resolve(__vite_injected_original_dirname, "styled-system")
      }
    }
  };
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCJDOlxcXFxVc2Vyc1xcXFxmZjE5MlxcXFxEb2N1bWVudHNcXFxcbmV3dFxcXFxuZXh0LXNjb3JlLXdhdGNoZXJcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZmlsZW5hbWUgPSBcIkM6XFxcXFVzZXJzXFxcXGZmMTkyXFxcXERvY3VtZW50c1xcXFxuZXd0XFxcXG5leHQtc2NvcmUtd2F0Y2hlclxcXFx2aXRlLmNvbmZpZy50c1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9pbXBvcnRfbWV0YV91cmwgPSBcImZpbGU6Ly8vQzovVXNlcnMvZmYxOTIvRG9jdW1lbnRzL25ld3QvbmV4dC1zY29yZS13YXRjaGVyL3ZpdGUuY29uZmlnLnRzXCI7aW1wb3J0IHsgc2VudHJ5Vml0ZVBsdWdpbiB9IGZyb20gXCJAc2VudHJ5L3ZpdGUtcGx1Z2luXCI7XG5pbXBvcnQgcmVhY3QgZnJvbSBcIkB2aXRlanMvcGx1Z2luLXJlYWN0LXN3Y1wiO1xuaW1wb3J0ICogYXMgcGF0aCBmcm9tIFwicGF0aFwiO1xuaW1wb3J0IHsgZGVmaW5lQ29uZmlnIH0gZnJvbSBcInZpdGVcIjtcbmltcG9ydCB7IFZpdGVQV0EgfSBmcm9tIFwidml0ZS1wbHVnaW4tcHdhXCI7XG5pbXBvcnQgdHNjb25maWdQYXRocyBmcm9tIFwidml0ZS10c2NvbmZpZy1wYXRoc1wiO1xuXG4vLyBodHRwczovL3ZpdGVqcy5kZXYvY29uZmlnL1xuZXhwb3J0IGRlZmF1bHQgZGVmaW5lQ29uZmlnKCgpID0+IHtcbiAgcmV0dXJuIHtcbiAgICBidWlsZDoge1xuICAgICAgc291cmNlbWFwOiB0cnVlLFxuICAgIH0sXG4gICAgcGx1Z2luczogW1xuICAgICAgcmVhY3QoKSxcbiAgICAgIHRzY29uZmlnUGF0aHMoeyByb290OiBcIi4vXCIgfSksXG4gICAgICBWaXRlUFdBKHtcbiAgICAgICAgcmVnaXN0ZXJUeXBlOiBcImF1dG9VcGRhdGVcIixcbiAgICAgIH0pLFxuICAgICAgcHJvY2Vzcy5lbnYuTk9ERV9FTlYgPT09IFwicHJvZHVjdGlvblwiICYmXG4gICAgICAgIHNlbnRyeVZpdGVQbHVnaW4oe1xuICAgICAgICAgIGF1dGhUb2tlbjogcHJvY2Vzcy5lbnYuU0VOVFJZX0FVVEhfVE9LRU4sXG4gICAgICAgICAgb3JnOiBcIm5ld3QyMzlcIixcbiAgICAgICAgICBwcm9qZWN0OiBcInNjb3JlLXdhdGNoZXJcIixcbiAgICAgICAgfSksXG4gICAgXSxcbiAgICByZXNvbHZlOiB7XG4gICAgICBhbGlhczoge1xuICAgICAgICBcIn5cIjogcGF0aC5yZXNvbHZlKF9fZGlybmFtZSwgXCJzcmNcIiksXG4gICAgICAgIFwiQHBhbmRhXCI6IHBhdGgucmVzb2x2ZShfX2Rpcm5hbWUsIFwic3R5bGVkLXN5c3RlbVwiKSxcbiAgICAgIH0sXG4gICAgfSxcbiAgfTtcbn0pO1xuIl0sCiAgIm1hcHBpbmdzIjogIjtBQUE4VSxTQUFTLHdCQUF3QjtBQUMvVyxPQUFPLFdBQVc7QUFDbEIsWUFBWSxVQUFVO0FBQ3RCLFNBQVMsb0JBQW9CO0FBQzdCLFNBQVMsZUFBZTtBQUN4QixPQUFPLG1CQUFtQjtBQUwxQixJQUFNLG1DQUFtQztBQVF6QyxJQUFPLHNCQUFRLGFBQWEsTUFBTTtBQUNoQyxTQUFPO0FBQUEsSUFDTCxPQUFPO0FBQUEsTUFDTCxXQUFXO0FBQUEsSUFDYjtBQUFBLElBQ0EsU0FBUztBQUFBLE1BQ1AsTUFBTTtBQUFBLE1BQ04sY0FBYyxFQUFFLE1BQU0sS0FBSyxDQUFDO0FBQUEsTUFDNUIsUUFBUTtBQUFBLFFBQ04sY0FBYztBQUFBLE1BQ2hCLENBQUM7QUFBQSxNQUNELFFBQVEsSUFBSSxhQUFhLGdCQUN2QixpQkFBaUI7QUFBQSxRQUNmLFdBQVcsUUFBUSxJQUFJO0FBQUEsUUFDdkIsS0FBSztBQUFBLFFBQ0wsU0FBUztBQUFBLE1BQ1gsQ0FBQztBQUFBLElBQ0w7QUFBQSxJQUNBLFNBQVM7QUFBQSxNQUNQLE9BQU87QUFBQSxRQUNMLEtBQVUsYUFBUSxrQ0FBVyxLQUFLO0FBQUEsUUFDbEMsVUFBZSxhQUFRLGtDQUFXLGVBQWU7QUFBQSxNQUNuRDtBQUFBLElBQ0Y7QUFBQSxFQUNGO0FBQ0YsQ0FBQzsiLAogICJuYW1lcyI6IFtdCn0K
