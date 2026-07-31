import { defineAppsyncRule } from "../lib/rule-types.js";
import { reportDefault } from "../lib/utils.js";

export default defineAppsyncRule({
  meta: {
    type: "problem",
    docs: {
      description: "Disallow generator functions in AppSync resolvers",
    },
    messages: {
      default: "Generators are not supported in the AppSync JS runtime",
    },
    schema: [],
  },
  createOnce(context) {
    const reportGenerator = (node: { generator?: boolean }) => {
      if (node.generator) {
        reportDefault(context, node as never);
      }
    };

    return {
      FunctionDeclaration: reportGenerator,
      FunctionExpression: reportGenerator,
    };
  },
});
