import type { Context, Definition, ESTree, Scope } from "@oxlint/plugins";
import { defineAppsyncRule } from "./types.js";
import { reportDefault } from "./utils.js";

const CALLBACK_ACCEPTING_METHODS = new Set([
  "map",
  "find",
  "filter",
  "findIndex",
  "findLast",
  "findLastIndex",
  "forEach",
  "reduce",
  "reduceRight",
  "every",
  "some",
  "flatMap",
]);

function getMemberPropertyName(
  property: ESTree.Node & { type: string },
): string | null {
  if (property.type === "Identifier") {
    return (property as unknown as { name: string }).name;
  }

  if (property.type === "Literal" && typeof property.value === "string") {
    return property.value;
  }

  return null;
}

function isCallbackAcceptingCall(callee: ESTree.Node): boolean {
  if (callee.type !== "MemberExpression") {
    return false;
  }

  const member = callee as ESTree.StaticMemberExpression | ESTree.ComputedMemberExpression;
  const propertyName = getMemberPropertyName(member.property);
  return propertyName !== null && CALLBACK_ACCEPTING_METHODS.has(propertyName);
}

function definitionCreatesFunction(def: Definition): boolean {
  if (def.type === "FunctionName") {
    return true;
  }

  if (def.type === "Variable" && def.node.type === "VariableDeclarator") {
    const init = def.node.init;
    if (!init) {
      return false;
    }

    return (
      init.type === "FunctionExpression" ||
      init.type === "ArrowFunctionExpression"
    );
  }

  return false;
}

function isFunctionLikeArgument(node: ESTree.Node, context: Context): boolean {
  if (
    node.type === "FunctionExpression" ||
    node.type === "ArrowFunctionExpression"
  ) {
    return true;
  }

  if (node.type !== "Identifier") {
    return false;
  }

  let scope: Scope | null = context.sourceCode.getScope(node);
  while (scope) {
    const variable = scope.set.get(node.name);
    if (variable?.defs.some(definitionCreatesFunction)) {
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
        "Disallow passing functions as call arguments except to allowlisted Array methods",
    },
    messages: {
      default: "Functions can not be passed as an argument",
    },
    schema: [],
  },
  createOnce(context) {
    return {
      CallExpression(node) {
        const allowsCallbacks = isCallbackAcceptingCall(node.callee);

        for (const argument of node.arguments) {
          if (argument.type === "SpreadElement") {
            continue;
          }

          if (argument.type === "ArrowFunctionExpression" && allowsCallbacks) {
            continue;
          }

          if (isFunctionLikeArgument(argument, context)) {
            reportDefault(context, argument);
          }
        }
      },
    };
  },
});
