import { defineAppsyncRule } from "../lib/rule-types.js";
import { reportDefault } from "../lib/utils.js";

export default defineAppsyncRule({
  meta: {
    type: "problem",
    docs: {
      description: "Disallow the in operator in AppSync resolvers",
    },
    messages: {
      default:
        "The in operator is not supported in the AppSync JS runtime; use Object.hasOwn instead",
    },
    schema: [],
  },
  createOnce(context) {
    return {
      BinaryExpression(node) {
        if (node.operator === "in") {
          reportDefault(context, node);
        }
      },
    };
  },
});
