import rule from "../../src/rules/no-async-await.js";
import { runAppsyncRuleTests } from "../helpers/rule-tester.js";

runAppsyncRuleTests("no-async-await", rule, {
  valid: [
    "function load() { return 1; }",
    "const load = () => 1;",
  ],
  invalid: [
    {
      code: "async function load() { return 1; }",
      errors: [{ messageId: "default" }],
    },
    {
      code: "const load = async () => 1;",
      errors: [{ messageId: "default" }],
    },
    {
      code: "async function load() { await value; }",
      errors: [{ messageId: "default" }, { messageId: "default" }],
    },
  ],
});
