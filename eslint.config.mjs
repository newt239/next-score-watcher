import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";
import prettier from "eslint-config-prettier";

const ONLINE_FILES = [
  "**/*online*/**/*.{ts,tsx,js,jsx}",
  "**/*online*.{ts,tsx,js,jsx}",
];

const eslintConfig = [
  {
    ignores: [
      "node_modules/",
      ".next/",
      "public/",
      "playwright-report/",
      "next-env.d.ts",
    ],
  },
  ...nextVitals,
  ...nextTs,
  prettier,
  {
    rules: {
      "react-hooks/exhaustive-deps": "off",
      "react-hooks/set-state-in-effect": "off",
      "react-hooks/incompatible-library": "off",
      "@typescript-eslint/no-explicit-any": "error",
      "@typescript-eslint/no-unused-vars": [
        "error",
        {
          argsIgnorePattern: "^_",
          varsIgnorePattern: "^_",
          caughtErrorsIgnorePattern: "^_",
        },
      ],
      "react/function-component-definition": [
        "error",
        {
          namedComponents: "arrow-function",
          unnamedComponents: "arrow-function",
        },
      ],
      "@typescript-eslint/consistent-type-imports": [
        "error",
        {
          prefer: "type-imports",
          fixStyle: "separate-type-imports",
          disallowTypeAnnotations: false,
        },
      ],
      "import/no-restricted-paths": [
        "error",
        {
          zones: [
            {
              target: ONLINE_FILES,
              from: ["src/utils/types.ts", "src/utils/db.ts"],
              message:
                "オンライン版の実装からローカル版の実装であるutils/types.ts, utils/db.ts へ参照することは禁止されています。",
            },
          ],
        },
      ],
      "import/order": [
        "error",
        {
          groups: [
            "builtin",
            "external",
            "parent",
            "sibling",
            "index",
            "object",
            "type",
          ],
          pathGroups: [
            {
              pattern: "{react,react-dom/**,react-router-dom,next,next/**}",
              group: "builtin",
              position: "before",
            },
          ],
          pathGroupsExcludedImportTypes: ["builtin"],
          alphabetize: {
            order: "asc",
          },
          "newlines-between": "always",
        },
      ],
    },
  },
];

export default eslintConfig;
