import rule from "../../src/rules/no-disallowed-methods.js";
import { runAppsyncRuleTests } from "../helpers/rule-tester.js";

runAppsyncRuleTests("no-disallowed-methods", rule, {
  valid: [
    "items.map((item) => item);",
    "value.toString();",
    "Object.keys(object);",
  ],
  invalid: [
    {
      code: "fn.call(null);",
      errors: [{ messageId: "default", data: { method: "call" } }],
    },
    {
      code: "fn.apply(null, []);",
      errors: [{ messageId: "default", data: { method: "apply" } }],
    },
    {
      code: "fn.bind(null);",
      errors: [{ messageId: "default", data: { method: "bind" } }],
    },
  ],
});
