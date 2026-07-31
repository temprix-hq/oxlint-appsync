import { defineAppsyncRule } from "../lib/rule-types.js";
import { reportDefault } from "../lib/utils.js";

export default defineAppsyncRule({
  meta: {
    type: "problem",
    docs: {
      description: "Disallow the instanceof operator in AppSync resolvers",
    },
    messages: {
      default: "The instanceof operator is not supported in the AppSync JS runtime",
    },
    schema: [],
  },
  createOnce(context) {
    return {
      BinaryExpression(node) {
        if (node.operator === "instanceof") {
          reportDefault(context, node);
        }
      },
    };
  },
});
