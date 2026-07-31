import rule from "../../src/rules/no-function-reassign.js";
import { runAppsyncRuleTests } from "../helpers/rule-tester.js";

runAppsyncRuleTests("no-function-reassign", rule, {
  valid: [
    "let count = 0; count = 1;",
    "function load() { return 1; }",
    `function request(ctx) {
      function inner() {
        let request = {};
        request = { operation: "GetItem" };
      }
    }`,
  ],
  invalid: [
    {
      code: "let load = () => 1; load = () => 2;",
      errors: [{ messageId: "default" }],
    },
    {
      code: "let handler = function handler() { return 1; }; handler = function handler() { return 2; };",
      errors: [{ messageId: "default" }],
    },
  ],
});
