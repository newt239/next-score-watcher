import react from "@vitejs/plugin-react-swc";
import * as path from "path";
import { defineConfig } from "vite";
import { VitePWA } from "vite-plugin-pwa";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  return {
    plugins: [react(), VitePWA({ registerType: "autoUpdate" })],
    resolve: {
      alias: {
        "#": path.resolve(__dirname, "src"),
      },
    },
  };
});
