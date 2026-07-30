import type { CreateOnceRule } from "@oxlint/plugins";

export type AppsyncRuleModule = CreateOnceRule;

export function defineAppsyncRule(rule: AppsyncRuleModule): AppsyncRuleModule {
  return rule;
}
