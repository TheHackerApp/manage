/** @type {import('lint-staged').Config} */
const config = {
  '*': ['prettier --write'],
  '*.{js,cjs,mjs,ts,tsx,graphql}': ['eslint --fix'],
};

export default config;
