import rule from "../../src/rules/no-promise.js";
import { runAppsyncRuleTests } from "../helpers/rule-tester.js";

runAppsyncRuleTests("no-promise", rule, {
  valid: [
    "function load() { return 1; }",
    "const value = 1;",
  ],
  invalid: [
    {
      code: "const value = Promise.resolve(1);",
      errors: [{ messageId: "default" }],
    },
    {
      code: "Promise.all([1, 2]);",
      errors: [{ messageId: "default" }],
    },
    {
      code: "new Promise((resolve) => resolve(1));",
      errors: [{ messageId: "default" }],
    },
  ],
});
