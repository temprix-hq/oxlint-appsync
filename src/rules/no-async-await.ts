import { defineAppsyncRule } from "../lib/rule-types.js";
import { reportDefault } from "../lib/utils.js";

export default defineAppsyncRule({
  meta: {
    type: "problem",
    docs: {
      description:
        "Disallow async functions and await expressions in AppSync resolvers",
    },
    messages: {
      default:
        "Promises and async/await are not supported in the AppSync JS runtime",
    },
    schema: [],
  },
  createOnce(context) {
    const reportAsyncFunction = (node: { async?: boolean }) => {
      if (node.async) {
        reportDefault(context, node as never);
      }
    };

    return {
      AwaitExpression(node) {
        reportDefault(context, node);
      },
      FunctionDeclaration: reportAsyncFunction,
      FunctionExpression: reportAsyncFunction,
      ArrowFunctionExpression: reportAsyncFunction,
    };
  },
});
