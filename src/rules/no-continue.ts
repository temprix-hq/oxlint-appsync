import { defineAppsyncRule } from "../lib/rule-types.js";
import { reportDefault } from "../lib/utils.js";

export default defineAppsyncRule({
  meta: {
    type: "problem",
    docs: {
      description: "Disallow continue statements in AppSync resolvers",
    },
    messages: {
      default: "continue statements are not supported in the AppSync JS runtime",
    },
    schema: [],
  },
  createOnce(context) {
    return {
      ContinueStatement(node) {
        reportDefault(context, node);
      },
    };
  },
});
