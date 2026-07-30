import rule from "../../src/rules/no-function-arguments.js";
import { runAppsyncRuleTests } from "../helpers/rule-tester.js";

runAppsyncRuleTests("no-function-arguments", rule, {
  valid: [
    "process(value);",
    "items.map((item) => item);",
    "items.some((i) => i.startsWith('team/createdBy/'));",
    "items.filter((x) => x.active);",
    "function transform(items) { return items; }",
  ],
  invalid: [
    {
      code: "const project = (item) => item; items.map(project);",
      errors: [{ messageId: "default" }],
    },
    {
      code: "function project(item) { return item; } items.map(project);",
      errors: [{ messageId: "default" }],
    },
    {
      code: "items.map(function (item) { return item; });",
      errors: [{ messageId: "default" }],
    },
    {
      code: "const handler = () => 1; run(handler);",
      errors: [{ messageId: "default" }],
    },
    {
      code: "run(() => 1);",
      errors: [{ messageId: "default" }],
    },
    {
      code: "items.sort((a, b) => a - b);",
      errors: [{ messageId: "default" }],
    },
    {
      code: [
        "updated.sort((left, right) => {",
        "  if (left.releasedAt < right.releasedAt) {",
        "    return -1;",
        "  }",
        "  if (left.releasedAt > right.releasedAt) {",
        "    return 1;",
        "  }",
        "  return 0;",
        "});",
      ].join("\n"),
      errors: [{ messageId: "default" }],
    },
  ],
});
