import { defineAppsyncRule } from "../lib/rule-types.js";
import { reportDefault } from "../lib/utils.js";

export default defineAppsyncRule({
  meta: {
    type: "problem",
    docs: {
      description: "Disallow ++ and -- operators in AppSync resolvers",
    },
    messages: {
      default: "++ and -- operators are not supported in the AppSync JS runtime",
    },
    schema: [],
  },
  createOnce(context) {
    return {
      UpdateExpression(node) {
        reportDefault(context, node);
      },
    };
  },
});
