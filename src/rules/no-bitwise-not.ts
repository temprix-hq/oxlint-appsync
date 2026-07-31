import { defineAppsyncRule } from "../lib/rule-types.js";
import { reportDefault } from "../lib/utils.js";

export default defineAppsyncRule({
  meta: {
    type: "problem",
    docs: {
      description: "Disallow the bitwise NOT (~) operator in AppSync resolvers",
    },
    messages: {
      default: "The ~ operator is not supported in the AppSync JS runtime",
    },
    schema: [],
  },
  createOnce(context) {
    return {
      UnaryExpression(node) {
        if (node.operator === "~") {
          reportDefault(context, node);
        }
      },
    };
  },
});
