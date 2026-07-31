import type { Context, Definition, ESTree, Scope } from "@oxlint/plugins";

type FunctionNode = ESTree.Node & {
  type:
    | "FunctionDeclaration"
    | "FunctionExpression"
    | "ArrowFunctionExpression";
  id?: { name: string } | null;
};

export function getMemberPropertyName(
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

export function definitionCreatesFunction(def: Definition): boolean {
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

export function isFunctionNode(node: ESTree.Node): node is FunctionNode {
  return (
    node.type === "FunctionDeclaration" ||
    node.type === "FunctionExpression" ||
    node.type === "ArrowFunctionExpression"
  );
}

export function isFunctionLikeNode(
  node: ESTree.Node,
  context: Context,
): boolean {
  if (
    node.type === "FunctionExpression" ||
    node.type === "ArrowFunctionExpression"
  ) {
    return true;
  }

  if (node.type !== "Identifier") {
    return false;
  }

  return variableHoldsFunction(node.name, context, node);
}

export function variableHoldsFunction(
  name: string,
  context: Context,
  referenceNode: ESTree.Node,
): boolean {
  let scope: Scope | null = context.sourceCode.getScope(referenceNode);
  while (scope) {
    const variable = scope.set.get(name);
    if (variable?.defs.some(definitionCreatesFunction)) {
      return true;
    }
    scope = scope.upper;
  }

  return false;
}
