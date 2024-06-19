/* eslint-disable @typescript-eslint/no-var-requires */
const { isComplexPluginOutput } = require('@graphql-codegen/plugin-helpers');
const { plugin: typescriptReactApolloPlugin } = require('@graphql-codegen/typescript-react-apollo');

/**
 * @param schema {import('graphql').GraphQLSchema}
 * @param rawDocuments {import('@graphql-codegen/plugin-helpers').Types.DocumentFile}
 * @param config
 * @return {Promise<import('@graphql-codegen/plugin-helpers').Types.PluginOutput>}
 */
async function generateReactApolloHelpers(schema, rawDocuments, config) {
  const result = typescriptReactApolloPlugin(schema, rawDocuments, config);
  // eslint-disable-next-line no-undef
  if (result instanceof Promise) return await result;
  else return result;
}

/** @type {import('@graphql-codegen/plugin-helpers').PluginFunction} */
const plugin = async (schema, rawDocuments, config) => {
  const result = await generateReactApolloHelpers(schema, rawDocuments, config);
  if (!isComplexPluginOutput(result)) return result;

  return {
    ...result,
    content: result.content.split('\n').slice(2).join('\n'),
  };
};

module.exports = { plugin };
