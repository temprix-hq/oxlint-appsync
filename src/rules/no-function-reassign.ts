import { variableHoldsFunction } from "../lib/function-utils.js";
import { defineAppsyncRule } from "../lib/rule-types.js";
import { reportDefault } from "../lib/utils.js";

export default defineAppsyncRule({
  meta: {
    type: "problem",
    docs: {
      description: "Disallow reassigning function variables in AppSync resolvers",
    },
    messages: {
      default: "Functions cannot be reassigned in the AppSync JS runtime",
    },
    schema: [],
  },
  createOnce(context) {
    return {
      AssignmentExpression(node) {
        if (node.left.type !== "Identifier") {
          return;
        }

        if (variableHoldsFunction(node.left.name, context, node.left)) {
          reportDefault(context, node.left);
        }
      },
    };
  },
});
