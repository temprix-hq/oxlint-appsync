import rule from "../../src/rules/no-function-return.js";
import { runAppsyncRuleTests } from "../helpers/rule-tester.js";

runAppsyncRuleTests("no-function-return", rule, {
  valid: [
    "function load() { return 1; }",
    "function load() { return value; }",
    "const project = (item) => item; [1].map(project);",
  ],
  invalid: [
    {
      code: "function load() { return () => 1; }",
      errors: [{ messageId: "default" }],
    },
    {
      code: "function load() { return function inner() { return 1; }; }",
      errors: [{ messageId: "default" }],
    },
    {
      code: "const project = (item) => item; function load() { return project; }",
      errors: [{ messageId: "default" }],
    },
  ],
});
