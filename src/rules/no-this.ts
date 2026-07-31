import { defineAppsyncRule } from "../lib/rule-types.js";
import { reportDefault } from "../lib/utils.js";

export default defineAppsyncRule({
  meta: {
    type: "problem",
    docs: {
      description: "Disallow this expressions in AppSync resolvers",
    },
    messages: {
      default: "this is not supported in the AppSync JS runtime",
    },
    schema: [],
  },
  createOnce(context) {
    return {
      ThisExpression(node) {
        reportDefault(context, node);
      },
    };
  },
});
