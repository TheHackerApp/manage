import { DocumentTransform } from '@apollo/client';
import { PersistedQueryManifestConfig } from '@apollo/generate-persisted-query-manifest';

import { typenameTransformer } from './src/graphql/transform';

const config: PersistedQueryManifestConfig = {
  documents: ['src/**/*.graphql'],
  output: process.env.OUTPUT_PATH ?? './persisted-query-manifest.json',
  documentTransform: new DocumentTransform(typenameTransformer),
};

export default config;
