import { GLOBAL_CONSTRUCTOR_NAMES } from "../lib/global-constructors.js";
import { defineAppsyncRule } from "../lib/rule-types.js";

export default defineAppsyncRule({
  meta: {
    type: "problem",
    docs: {
      description:
        "Disallow calling global constructor functions in AppSync resolvers",
    },
    messages: {
      default:
        "Do not use `{{name}}()` as a constructor in the AppSync JS runtime",
    },
    schema: [],
  },
  createOnce(context) {
    return {
      CallExpression(node) {
        if (
          node.callee.type === "Identifier" &&
          GLOBAL_CONSTRUCTOR_NAMES.has(node.callee.name)
        ) {
          context.report({
            node,
            messageId: "default",
            data: { name: node.callee.name },
          });
        }
      },
    };
  },
});
