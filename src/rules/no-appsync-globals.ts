import type { Rule } from "eslint";
import { APPSYNC_GLOBAL_NAMES } from "./appsync-globals.js";
import { defineAppsyncRule } from "./types.js";

function isBindingPosition(node: Rule.Node): boolean {
  const parent = node.parent;
  if (!parent) {
    return false;
  }

  if (
    parent.type === "VariableDeclarator" ||
    parent.type === "FunctionDeclaration" ||
    parent.type === "FunctionExpression" ||
    parent.type === "ClassDeclaration"
  ) {
    return parent.id === node;
  }

  if (
    parent.type === "ImportSpecifier" ||
    parent.type === "ImportDefaultSpecifier" ||
    parent.type === "ImportNamespaceSpecifier"
  ) {
    return parent.local === node;
  }

  if (parent.type === "CatchClause") {
    return parent.param === node;
  }

  return false;
}

function isNonReferencePosition(node: Rule.Node): boolean {
  const parent = node.parent;
  if (!parent) {
    return false;
  }

  if (parent.type === "Property" && parent.key === node && !parent.computed) {
    return true;
  }

  if (
    parent.type === "MemberExpression" &&
    parent.property === node &&
    !parent.computed
  ) {
    return true;
  }

  return isBindingPosition(node);
}

function hasLocalBinding(
  node: Rule.Node & { type: "Identifier"; name: string },
  context: Rule.RuleContext,
): boolean {
  let scope: Rule.Scope.Scope | null = context.sourceCode.getScope(node);
  while (scope) {
    const variable = scope.set.get(node.name);
    if (variable && variable.defs.length > 0) {
      return true;
    }
    scope = scope.upper;
  }

  return false;
}

export default defineAppsyncRule({
  meta: {
    type: "problem",
    docs: {
      description:
        "Disallow AppSync-only globals in code that must run outside the AppSync runtime",
    },
    messages: {
      default:
        "AppSync global `{{name}}` is not available outside the AppSync runtime",
    },
    schema: [],
  },
  createOnce(context) {
    return {
      Identifier(node) {
        if (!APPSYNC_GLOBAL_NAMES.has(node.name)) {
          return;
        }

        if (isNonReferencePosition(node)) {
          return;
        }

        if (hasLocalBinding(node, context)) {
          return;
        }

        context.report({
          node,
          messageId: "default",
          data: { name: node.name },
        });
      },
    };
  },
});
