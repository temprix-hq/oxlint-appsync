import rule from "../../src/rules/no-appsync-globals.js";
import { runAppsyncRuleTests } from "../helpers/rule-tester.js";

runAppsyncRuleTests("no-appsync-globals", rule, {
  valid: [
    "const util = { error: (msg) => { throw new Error(msg); } }; util.error('failed');",
    "import util from './util.js'; util.error('failed');",
    "const obj = { util: 1 };",
    "const key = 'util'; obj[key];",
    "throw new Error('failed');",
    "function runtime() { return 1; } runtime();",
  ],
  invalid: [
    {
      code: "util.error('failed');",
      errors: [{ messageId: "default" }],
    },
    {
      code: "util.time.nowISO8601();",
      errors: [{ messageId: "default" }],
    },
    {
      code: "runtime.earlyReturn({ data: true });",
      errors: [{ messageId: "default" }],
    },
    {
      code: "extensions.set('key', value);",
      errors: [{ messageId: "default" }],
    },
    {
      code: "const handler = util;",
      errors: [{ messageId: "default" }],
    },
  ],
});
