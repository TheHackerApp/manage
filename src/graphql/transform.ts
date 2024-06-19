import { type ASTNode, DocumentNode, Kind, visit } from 'graphql';

export const typenameTransformer = (document: DocumentNode): DocumentNode =>
  visit(document, {
    SelectionSet(node, _, parent) {
      const isRoot =
        typeof (parent as ASTNode)?.kind === 'string' && (parent as ASTNode).kind === 'OperationDefinition';
      const alreadyHasTypename = node.selections.find(
        (selection) => selection.kind === 'Field' && selection.name.value === '__typename',
      );

      if (isRoot || alreadyHasTypename) return undefined;

      return {
        ...node,
        selections: [
          ...node.selections,
          {
            kind: Kind.FIELD,
            name: {
              kind: Kind.NAME,
              value: '__typename',
            },
          },
        ],
      };
    },
  });
