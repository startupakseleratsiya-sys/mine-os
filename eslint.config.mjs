import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
  ]),
  {
    rules: {
      // O'zbekcha matnda apostrof (o'zbek, ta'lim) ko'p — JSX ichida &apos; talab qilish shovqin.
      "react/no-unescaped-entities": "off",
    },
  },
]);

export default eslintConfig;
