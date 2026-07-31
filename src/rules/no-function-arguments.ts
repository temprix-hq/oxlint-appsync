import type { Context, ESTree, Scope } from "@oxlint/plugins";
import { CALLBACK_ACCEPTING_METHODS } from "../lib/callback-accepting-methods.js";
import {
    definitionCreatesFunction,
    getMemberPropertyName,
} from "../lib/function-utils.js";
import { defineAppsyncRule } from "../lib/rule-types.js";
import { reportDefault } from "../lib/utils.js";

function isCallbackAcceptingCall(callee: ESTree.Node): boolean {
  if (callee.type !== "MemberExpression") {
    return false;
  }

  const member = callee as
    | ESTree.StaticMemberExpression
    | ESTree.ComputedMemberExpression;
  const propertyName = getMemberPropertyName(member.property);
  return propertyName !== null && CALLBACK_ACCEPTING_METHODS.has(propertyName);
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
    scope = scope.upper ?? null;
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
