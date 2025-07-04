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
    "import/order": [
      "error",
      {
        "groups": [
          "builtin",
          "external",
          "parent",
          "sibling",
          "index",
          "object",
          "type",
        ],
        "pathGroups": [
          {
            pattern: "{react,react-dom/**,react-router-dom,next,next/**}",
            group: "builtin",
            position: "before",
          },
          {
            pattern: "#/**",
            group: "parent",
            position: "before",
          },
        ],
        "pathGroupsExcludedImportTypes": ["builtin", "object"],
        "alphabetize": {
          order: "asc",
        },
        "newlines-between": "always",
      },
    ],
  },
}, {
  files: ["**/*.css"],
  language: "css/css",
  plugins: { css },
  extends: ["css/recommended"],
});
