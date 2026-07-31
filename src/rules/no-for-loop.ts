import { defineAppsyncRule } from "../lib/rule-types.js";
import { reportDefault } from "../lib/utils.js";

export default defineAppsyncRule({
  meta: {
    type: "problem",
    docs: {
      description:
        "Disallow C-style for loops in AppSync resolvers (for-in and for-of are allowed)",
    },
    messages: {
      default:
        "Only for-in and for-of loops are supported in the AppSync JS runtime",
    },
    schema: [],
  },
  createOnce(context) {
    return {
      ForStatement(node) {
        reportDefault(context, node);
      },
    };
  },
});
