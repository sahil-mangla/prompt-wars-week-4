import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";

const eslintConfig = defineConfig([
  ...nextVitals,
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
      "no-restricted-imports": [
        "error",
        {
          patterns: [
            {
              group: [
                "**/lib/constants/*",
                "**/constants/*",
                "!**/lib/constants/index",
                "!**/constants/index",
              ],
              message:
                "Please import constants from '@/lib/constants' or '@/constants' directly rather than from sub-modules to keep imports clean and decoupled.",
            },
          ],
        },
      ],
    },
  },
]);

export default eslintConfig;
