import { DISALLOWED_METHOD_NAMES } from "../lib/disallowed-methods.js";
import { getMemberPropertyName } from "../lib/function-utils.js";
import { defineAppsyncRule } from "../lib/rule-types.js";

export default defineAppsyncRule({
  meta: {
    type: "problem",
    docs: {
      description:
        "Disallow unsupported method calls such as call, apply, and bind",
    },
    messages: {
      default:
        "The {{method}}() method is not supported in the AppSync JS runtime",
    },
    schema: [],
  },
  createOnce(context) {
    return {
      CallExpression(node) {
        if (node.callee.type !== "MemberExpression") {
          return;
        }

        const method = getMemberPropertyName(node.callee.property);
        if (method && DISALLOWED_METHOD_NAMES.has(method)) {
          context.report({
            node,
            messageId: "default",
            data: { method },
          });
        }
      },
    };
  },
});
