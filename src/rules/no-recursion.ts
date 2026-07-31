import type { Context, ESTree } from "@oxlint/plugins";
import { isFunctionNode } from "../lib/function-utils.js";
import { defineAppsyncRule } from "../lib/rule-types.js";
import { reportDefault } from "../lib/utils.js";

function getEnclosingBindingNames(
  node: ESTree.Node,
  context: Context,
): Set<string> {
  const names = new Set<string>();

  if (
    (node.type === "FunctionDeclaration" || node.type === "FunctionExpression") &&
    node.id?.type === "Identifier"
  ) {
    names.add(node.id.name);
  }

  let scope = context.sourceCode.getScope(node).upper;
  while (scope) {
    for (const variable of scope.variables) {
      for (const def of variable.defs) {
        if (
          def.type === "Variable" &&
          def.node.type === "VariableDeclarator" &&
          def.node.init === node
        ) {
          names.add(variable.name);
        }
      }
    }
    scope = scope.upper;
  }

  return names;
}

export default defineAppsyncRule({
  meta: {
    type: "problem",
    docs: {
      description: "Disallow recursive function calls in AppSync resolvers",
    },
    messages: {
      default: "Recursive function calls are not supported in the AppSync JS runtime",
    },
    schema: [],
  },
  createOnce(context) {
    const enclosingBindingNames: Set<string>[] = [];

    const enterFunction = (node: ESTree.Node) => {
      if (!isFunctionNode(node)) {
        return;
      }

      enclosingBindingNames.push(getEnclosingBindingNames(node, context));
    };

    const exitFunction = (node: ESTree.Node) => {
      if (!isFunctionNode(node)) {
        return;
      }

      enclosingBindingNames.pop();
    };

    return {
      FunctionDeclaration: enterFunction,
      "FunctionDeclaration:exit": exitFunction,
      FunctionExpression: enterFunction,
      "FunctionExpression:exit": exitFunction,
      ArrowFunctionExpression: enterFunction,
      "ArrowFunctionExpression:exit": exitFunction,
      CallExpression(node) {
        if (node.callee.type !== "Identifier") {
          return;
        }

        const currentBindings =
          enclosingBindingNames[enclosingBindingNames.length - 1];
        if (currentBindings?.has(node.callee.name)) {
          reportDefault(context, node);
        }
      },
    };
  },
});
