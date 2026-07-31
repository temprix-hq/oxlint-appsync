import { eslintCompatPlugin } from "@oxlint/plugins";
import { RuleTester } from "eslint";
import { describe, it } from "vitest";
import type { AppsyncRuleModule } from "../../src/lib/rule-types.js";

RuleTester.describe = describe;
RuleTester.it = it;

const tester = new RuleTester({
  languageOptions: {
    ecmaVersion: 2022,
    sourceType: "module",
  },
});

type RuleTestCase = {
  code: string;
  errors?: { messageId?: string; message?: string }[];
};

export function runAppsyncRuleTests(
  ruleName: string,
  rule: AppsyncRuleModule,
  tests: {
    valid: (string | RuleTestCase)[];
    invalid: RuleTestCase[];
  },
): void {
  const plugin = eslintCompatPlugin({
    meta: { name: "appsync" },
    rules: { [ruleName]: rule },
  });

  const eslintRule = plugin.rules[ruleName];
  if (!eslintRule) {
    throw new Error(`Rule ${ruleName} was not registered on the plugin`);
  }

  describe(ruleName, () => {
    tester.run(`appsync/${ruleName}`, eslintRule, tests);
  });
}
