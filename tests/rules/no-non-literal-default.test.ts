import rule from "../../src/rules/no-non-literal-default.js";
import { runAppsyncRuleTests } from "../helpers/rule-tester.js";

runAppsyncRuleTests("no-non-literal-default", rule, {
  valid: [
    "function load(id) { return id; }",
    "function load(...ids) { return ids; }",
    "function load(id = 1) { return id; }",
    "function load(name = \"item\") { return name; }",
    "function load(enabled = true) { return enabled; }",
    "function load(enabled = false) { return enabled; }",
    "function load(value = null) { return value; }",
    "function load(offset = -1) { return offset; }",
    "function load(offset = +1) { return offset; }",
    "function load(extra = {}) { return extra; }",
    "function load(items = []) { return items; }",
    "const load = (id = 1) => id;",
    "const load = function (id = 1) { return id; };",
    "function load({ id = 1 } = {}) { return id; }",
    "function load([id = \"x\"] = []) { return id; }",
    "function load(id = 1, ...rest) { return rest; }",
  ],
  invalid: [
    {
      code: "function load(today = utcPlainDateToday()) { return today; }",
      errors: [{ messageId: "default" }],
    },
    {
      code: "function load(days = LOOKBACK_DAYS) { return days; }",
      errors: [{ messageId: "default" }],
    },
    {
      code: "function load(value = obj.prop) { return value; }",
      errors: [{ messageId: "default" }],
    },
    {
      code: "function load(created = new Date()) { return created; }",
      errors: [{ messageId: "default" }],
    },
    {
      code: "function load(label = `day ${n}`) { return label; }",
      errors: [{ messageId: "default" }],
    },
    {
      code: "function load(label = `day`) { return label; }",
      errors: [{ messageId: "default" }],
    },
    {
      code: "function load(extra = { id: 1 }) { return extra; }",
      errors: [{ messageId: "default" }],
    },
    {
      code: "function load(items = [1]) { return items; }",
      errors: [{ messageId: "default" }],
    },
    {
      code: "function load(extra = { ...source }) { return extra; }",
      errors: [{ messageId: "default" }],
    },
    {
      code: "function load(value = undefined) { return value; }",
      errors: [{ messageId: "default" }],
    },
    {
      code: "function load(pattern = /a/) { return pattern; }",
      errors: [{ messageId: "default" }],
    },
    {
      code: "function load(count = 1n) { return count; }",
      errors: [{ messageId: "default" }],
    },
    {
      code: "const load = (today = utcPlainDateToday()) => today;",
      errors: [{ messageId: "default" }],
    },
    {
      code: "const load = function (today = utcPlainDateToday()) { return today; };",
      errors: [{ messageId: "default" }],
    },
    {
      code: "function load({ today = utcPlainDateToday() }) { return today; }",
      errors: [{ messageId: "default" }],
    },
    {
      code: "function load([today = utcPlainDateToday()]) { return today; }",
      errors: [{ messageId: "default" }],
    },
    {
      code: "function load({ range: { from = today } }) { return from; }",
      errors: [{ messageId: "default" }],
    },
    {
      code: "function load(today = utcPlainDateToday(), days = 1) { return days; }",
      errors: [{ messageId: "default" }],
    },
    {
      code: "function outer(id = 1) { function inner(today = utcPlainDateToday()) { return today; } return inner(id); }",
      errors: [{ messageId: "default" }],
    },
  ],
});
