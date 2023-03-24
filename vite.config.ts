import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import { visualizer } from "rollup-plugin-visualizer";
import * as path from "path";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  return {
    plugins: [react()],
    resolve: {
      alias: {
        "#": path.resolve(__dirname, "src"),
      },
    },
    build: {
      rollupOptions: {
        plugins: [
          mode === "analyze" &&
            visualizer({
              open: true,
              filename: "dist/stats.html",
              gzipSize: true,
              brotliSize: true,
            }),
        ],
      },
    },
  };
});
