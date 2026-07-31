import rule from "../../src/rules/no-context-reassignment.js";
import { runAppsyncRuleTests } from "../helpers/rule-tester.js";

runAppsyncRuleTests("no-context-reassignment", rule, {
  valid: [
    "function handler(context) { const value = context.args.id; }",
    "function handler(context) { const stash = context.stash; }",
    "function handler(ctx) { ctx.args.id = 'value'; }",
    "function handler(context) { context.stash.value = 'x'; }",
  ],
  invalid: [
    {
      code: "function handler(context) { context = {}; }",
      errors: [{ messageId: "default" }],
    },
    {
      code: "function handler(context) { context.args = {}; }",
      errors: [{ messageId: "default" }],
    },
  ],
});
