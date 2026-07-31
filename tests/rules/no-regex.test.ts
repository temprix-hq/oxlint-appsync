import rule from "../../src/rules/no-regex.js";
import { runAppsyncRuleTests } from "../helpers/rule-tester.js";

runAppsyncRuleTests("no-regex", rule, {
  valid: [
    'expression.expression.replace("^SET\\\\s+", "").split("\\\\s+REMOVE\\\\s+")[0];',
    "const n = 42;",
    'const s = "hello";',
  ],
  invalid: [
    {
      code: 'const setPart = expression.expression.replace(/^SET\\s+/, "").split(/\\s+REMOVE\\s+/)[0];',
      errors: [{ messageId: "default" }, { messageId: "default" }],
    },
    {
      code: "const re = /abc/g;",
      errors: [{ messageId: "default" }],
    },
    {
      code: '"foo".match(/bar/);',
      errors: [{ messageId: "default" }],
    },
  ],
});
