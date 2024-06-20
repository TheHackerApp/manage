/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config) => {
    const extensionAlias = config.resolve.extensionAlias ?? {};
    extensionAlias['.graphql'] = ['.graphql.ts'];
    config.resolve.extensionAlias = extensionAlias;

    return config;
  },
};

export default nextConfig;
