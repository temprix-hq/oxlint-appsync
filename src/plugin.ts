import { eslintCompatPlugin } from "@oxlint/plugins";
import rules from "./rules/index.js";

const OPT_IN_RULES = new Set(["no-appsync-globals"]);

export const plugin = eslintCompatPlugin({
  meta: {
    name: "appsync",
  },
  rules,
});

export const recommended = Object.fromEntries(
  Object.keys(rules)
    .filter((ruleName) => !OPT_IN_RULES.has(ruleName))
    .map((ruleName) => [`appsync/${ruleName}`, "error"]),
) as Record<`appsync/${Exclude<keyof typeof rules, "no-appsync-globals">}`, "error">;

export const portable = {
  ...recommended,
  "appsync/no-appsync-globals": "error",
} as const;
