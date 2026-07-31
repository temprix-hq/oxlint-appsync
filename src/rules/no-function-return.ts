import { isFunctionLikeNode } from "../lib/function-utils.js";
import { defineAppsyncRule } from "../lib/rule-types.js";
import { reportDefault } from "../lib/utils.js";

export default defineAppsyncRule({
  meta: {
    type: "problem",
    docs: {
      description:
        "Disallow returning functions from functions in AppSync resolvers",
    },
    messages: {
      default:
        "Functions cannot be the return value of functions in the AppSync JS runtime",
    },
    schema: [],
  },
  createOnce(context) {
    return {
      ReturnStatement(node) {
        if (!node.argument) {
          return;
        }

        if (isFunctionLikeNode(node.argument, context)) {
          reportDefault(context, node.argument);
        }
      },
    };
  },
});
