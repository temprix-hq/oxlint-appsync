import type { Context, ESTree } from "@oxlint/plugins";
import { defineAppsyncRule } from "../lib/rule-types.js";
import { reportDefault } from "../lib/utils.js";

function unwrap(node: ESTree.Node): ESTree.Node {
  let current = node;
  while (
    current.type === "TSAsExpression" ||
    current.type === "TSTypeAssertion" ||
    current.type === "TSSatisfiesExpression" ||
    current.type === "TSNonNullExpression" ||
    current.type === "ParenthesizedExpression"
  ) {
    current = current.expression;
  }
  return current;
}

// AppSync keeps literal default initializers and silently ignores other expressions.
function isAllowedDefault(node: ESTree.Node): boolean {
  const value = unwrap(node);

  if (value.type === "Literal") {
    if ("regex" in value && value.regex) {
      return false;
    }
    if ("bigint" in value && value.bigint != null) {
      return false;
    }
    const literalValue = value.value;
    return (
      literalValue === null ||
      typeof literalValue === "string" ||
      typeof literalValue === "number" ||
      typeof literalValue === "boolean"
    );
  }

  if (
    value.type === "UnaryExpression" &&
    (value.operator === "+" || value.operator === "-")
  ) {
    const argument = unwrap(value.argument);
    return argument.type === "Literal" && typeof argument.value === "number";
  }

  if (value.type === "ObjectExpression") {
    return value.properties.length === 0;
  }

  if (value.type === "ArrayExpression") {
    return value.elements.length === 0;
  }

  return false;
}

function visitPattern(
  pattern: ESTree.Node | null | undefined,
  context: Context,
): void {
  if (!pattern) {
    return;
  }

  switch (pattern.type) {
    case "AssignmentPattern": {
      if (!isAllowedDefault(pattern.right)) {
        reportDefault(context, pattern.right);
      }
      visitPattern(pattern.left, context);
      return;
    }
    case "ObjectPattern": {
      for (const property of pattern.properties) {
        if (property.type === "RestElement") {
          visitPattern(property.argument, context);
        } else {
          visitPattern(property.value, context);
        }
      }
      return;
    }
    case "ArrayPattern": {
      for (const element of pattern.elements) {
        if (!element) {
          continue;
        }
        if (element.type === "RestElement") {
          visitPattern(element.argument, context);
        } else {
          visitPattern(element, context);
        }
      }
      return;
    }
    case "RestElement":
      visitPattern(pattern.argument, context);
      return;
    case "TSParameterProperty":
      visitPattern(pattern.parameter, context);
      return;
    default:
      return;
  }
}

function checkFunction(
  node: ESTree.Function | ESTree.ArrowFunctionExpression,
  context: Context,
): void {
  for (const param of node.params) {
    visitPattern(param, context);
  }
}

export default defineAppsyncRule({
  meta: {
    type: "problem",
    docs: {
      description:
        "Disallow non-literal default parameters in AppSync resolvers",
    },
    messages: {
      default:
        "Non-literal default parameters are ignored in the AppSync JS runtime. Pass the value explicitly at the call site.",
    },
    schema: [],
  },
  createOnce(context) {
    const check = (node: ESTree.Node) => {
      if (
        node.type === "FunctionDeclaration" ||
        node.type === "FunctionExpression" ||
        node.type === "ArrowFunctionExpression"
      ) {
        checkFunction(node, context);
      }
    };

    return {
      FunctionDeclaration: check,
      FunctionExpression: check,
      ArrowFunctionExpression: check,
    };
  },
});
