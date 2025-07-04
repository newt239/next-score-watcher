import antfu from "@antfu/eslint-config";
import css from "@eslint/css";

export default antfu({
  css: false,
  react: true,
  typescript: true,
}, {
  rules: {
    "style/quotes": ["error", "double"],
    "style/semi": ["error", "always"],
  },
}, {
  files: ["**/*.css"],
  language: "css/css",
  plugins: { css },
  extends: ["css/recommended"],
});
