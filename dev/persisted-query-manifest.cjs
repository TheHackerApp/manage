/* eslint-disable @typescript-eslint/no-var-requires */
const { generatePersistedQueryManifest } = require('@apollo/generate-persisted-query-manifest');

/** @type {import('@graphql-codegen/plugin-helpers').PluginFunction} */
const plugin = async () => {
  const manifest = await generatePersistedQueryManifest(
    { documents: ['src/**/*.graphql'] },
    'persisted-query-manifest.ts',
  );
  return JSON.stringify(manifest, null, 2);
};

module.exports = { plugin };
