import type { Context, ESTree } from "@oxlint/plugins";

type NodeWithType = { type: string };

export function isIdentifier(
  node: NodeWithType | null | undefined,
  name: string,
): boolean {
  return (
    node?.type === "Identifier" &&
    (node as unknown as { name: string }).name === name
  );
}

export function reportDefault(
  context: Context,
  node: ESTree.Node,
  messageId = "default",
): void {
  context.report({ node, messageId });
}
