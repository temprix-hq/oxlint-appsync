import type { ESTree } from "@oxlint/plugins";
import { defineAppsyncRule } from "../lib/rule-types.js";
import { isIdentifier, reportDefault } from "../lib/utils.js";

function isContextAssignmentTarget(node: ESTree.Node): boolean {
  if (isIdentifier(node, "context")) {
    return true;
  }

  return (
    node.type === "MemberExpression" && isIdentifier(node.object, "context")
  );
}

export default defineAppsyncRule({
  meta: {
    type: "problem",
    docs: {
      description:
        "Disallow reassigning context and its base properties in AppSync resolvers",
    },
    messages: {
      default:
        "Reassigning context and base properties of context is not supported in the AppSync JS runtime",
    },
    schema: [],
  },
  createOnce(context) {
    return {
      AssignmentExpression(node) {
        if (isContextAssignmentTarget(node.left)) {
          reportDefault(context, node.left);
        }
      },
    };
  },
});
