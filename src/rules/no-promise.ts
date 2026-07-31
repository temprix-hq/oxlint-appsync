import { defineAppsyncRule } from "../lib/rule-types.js";
import { isIdentifier, reportDefault } from "../lib/utils.js";

export default defineAppsyncRule({
  meta: {
    type: "problem",
    docs: {
      description: "Disallow Promise usage in AppSync resolvers",
    },
    messages: {
      default: "Promises are not supported in the AppSync JS runtime",
    },
    schema: [],
  },
  createOnce(context) {
    return {
      CallExpression(node) {
        const { callee } = node;

        if (
          isIdentifier(callee, "Promise") ||
          (callee.type === "MemberExpression" &&
            isIdentifier(callee.object, "Promise"))
        ) {
          reportDefault(context, node);
        }
      },
      NewExpression(node) {
        if (isIdentifier(node.callee, "Promise")) {
          reportDefault(context, node);
        }
      },
      VariableDeclarator(node) {
        if (node.init && isIdentifier(node.init, "Promise")) {
          reportDefault(context, node.init);
        }
      },
      AssignmentExpression(node) {
        if (isIdentifier(node.right, "Promise")) {
          reportDefault(context, node.right);
        }
      },
    };
  },
});
