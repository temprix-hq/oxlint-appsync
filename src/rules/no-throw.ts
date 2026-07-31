import { defineAppsyncRule } from "../lib/rule-types.js";
import { reportDefault } from "../lib/utils.js";

export default defineAppsyncRule({
  meta: {
    type: "problem",
    docs: {
      description: "Disallow throw statements in AppSync resolvers",
    },
    messages: {
      default: "throw statements are not supported in the AppSync JS runtime",
    },
    schema: [],
  },
  createOnce(context) {
    return {
      ThrowStatement(node) {
        reportDefault(context, node);
      },
    };
  },
});
