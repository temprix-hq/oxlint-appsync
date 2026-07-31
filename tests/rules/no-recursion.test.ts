import rule from "../../src/rules/no-recursion.js";
import { runAppsyncRuleTests } from "../helpers/rule-tester.js";

runAppsyncRuleTests("no-recursion", rule, {
  valid: [
    "function outer() { return inner(); } function inner() { return 1; }",
    "const load = () => 1;",
  ],
  invalid: [
    {
      code: "function recurse() { recurse(); }",
      errors: [{ messageId: "default" }],
    },
    {
      code: "const load = () => { load(); };",
      errors: [{ messageId: "default" }],
    },
    {
      code: "const load = function load() { load(); };",
      errors: [{ messageId: "default" }],
    },
  ],
});
