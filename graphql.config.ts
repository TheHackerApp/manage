import type { CodegenConfig } from '@graphql-codegen/cli';
import type { IGraphQLProject, SchemaPointer } from 'graphql-config';

import 'dotenv/config';

import { typenameTransformer } from './src/graphql/transform';

function resolveSource(): SchemaPointer {
  const SCHEMA_SOURCE = process.env.GRAPHQL_SCHEMA_SOURCE;
  if (SCHEMA_SOURCE === undefined) throw new Error('Unknown schema source. Is GRAPHQL_SCHEMA_SOURCE set?');

  try {
    const url = new URL(SCHEMA_SOURCE);
    if (url.protocol !== 'http:' && url.protocol !== 'https:') return SCHEMA_SOURCE;
  } catch {
    return SCHEMA_SOURCE;
  }

  const headers = Object.fromEntries(
    (process.env.GRAPHQL_SCHEMA_HEADERS || '')
      .trim()
      .split(',')
      .map((header) => header.split('=', 2))
      .filter((header) => header.length === 2 && header.every((part) => part.length > 0)),
  );

  const isSdl = (process.env.GRAPHQL_SCHEMA_IS_SDL || 'false').toLowerCase().trim();
  const handleAsSDL = isSdl === 'true' || isSdl === 't' || isSdl === '1';

  // @ts-expect-error handleAsSDL is not defined for the generic graphql config, but is for GraphQL codegen
  return { [SCHEMA_SOURCE]: { headers, handleAsSDL } };
}

const codegen: CodegenConfig = {
  config: {
    useTypeImports: true,
  },
  generates: {
    'src/graphql/types.ts': {
      plugins: ['typescript', { add: { content: '/* eslint-disable */' } }],
      config: {
        immutableTypes: true,
        nonOptionalTypename: true,
      },
    },
    'src/graphql/persisted-query-manifest.json': {
      plugins: ['./dev/persisted-query-manifest.cjs'],
    },
    'src/': {
      preset: 'near-operation-file',
      presetConfig: {
        baseTypesPath: '~@/graphql/types',
        extension: '.graphql.ts',
      },
      plugins: [
        'typescript-operations',
        './dev/react-apollo.cjs',
        'typed-document-node',
        { add: { content: '/* eslint-disable */' } },
      ],
      config: {
        addOperationExport: true,
        documentNodeImport: '@graphql-typed-document-node/core#TypedDocumentNode',
        documentMode: 'documentNode',
      },
      documentTransforms: [
        {
          transform({ documents }) {
            return documents.map((document) => ({
              ...document,
              document: document.document ? typenameTransformer(document.document) : undefined,
            }));
          },
        },
      ],
    },
  },
  ignoreNoDocuments: true,
};

const config: IGraphQLProject = {
  schema: resolveSource(),
  documents: ['src/**/*.graphql'],
  extensions: { codegen },
};

export default config;
