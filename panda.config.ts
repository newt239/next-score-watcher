import { defineConfig } from "@pandacss/dev";

export default defineConfig({
  preflight: true,
  include: [
    "./src/app/**/*.{js,jsx,ts,tsx}",
    "./src/components/**/*.{js,jsx,ts,tsx}",
  ],
  exclude: [],
  theme: {
    extend: {},
  },
  outdir: "styled-system",
});
