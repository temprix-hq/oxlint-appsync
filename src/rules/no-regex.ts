import { defineAppsyncRule } from "../lib/rule-types.js";
import { reportDefault } from "../lib/utils.js";

export default defineAppsyncRule({
  meta: {
    type: "problem",
    docs: {
      description: "Disallow regex literals in AppSync resolvers",
    },
    messages: {
      default: "Regex literals are not supported in the AppSync JS runtime",
    },
    schema: [],
  },
  createOnce(context) {
    return {
      Literal(node) {
        if ("regex" in node && node.regex) {
          reportDefault(context, node);
        }
      },
      RegExpLiteral(node) {
        reportDefault(context, node);
      },
    };
  },
});
