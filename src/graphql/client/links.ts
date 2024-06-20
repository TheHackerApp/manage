import { ApolloLink, InMemoryCacheConfig, Operation, TypePolicies } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import { onError } from '@apollo/client/link/error';
import { createPersistedQueryLink } from '@apollo/client/link/persisted-queries';
import { RetryLink } from '@apollo/client/link/retry';
import { InMemoryCache } from '@apollo/experimental-nextjs-app-support';
import { generatePersistedQueryIdsFromManifest } from '@apollo/persisted-query-lists';
import toast from 'react-hot-toast';

/**
 * Create the default set of links used, regardless of client type
 */
export function defaultLinkMiddleware(): ApolloLink {
  const retry = new RetryLink({
    delay: {
      initial: 250,
      jitter: true,
    },
    attempts: { max: 3 },
  });
  const persistedQueries = createPersistedQueryLink(
    generatePersistedQueryIdsFromManifest({
      loadManifest: () => import('@/graphql/persisted-query-manifest.json'),
    }),
  );
  const errorHandler = onError(({ operation, graphQLErrors, networkError }) => {
    if (graphQLErrors) {
      for (const { message, locations, path } of graphQLErrors) {
        let formatted = message;
        if (path) formatted += ` at '${path}'`;
        if (locations)
          formatted += ` (line ${locations.map((loc) => `${loc.line}:${loc.column}`).join(', ')}) in query`;
        logError(operation, 'GraphQL', formatted);
      }
    }
    if (networkError) logError(operation, 'Network', networkError.toString());

    if (typeof window !== 'undefined') toast.error('Operation failed. Please try again later.');
  });
  const scopeToEvent = setContext((_request, { event, headers = {} }) => {
    if (event) headers['Event-Slug'] = event;
    return { headers };
  });

  return ApolloLink.from([scopeToEvent, errorHandler, persistedQueries, retry]);
}

const logError = (operation: Operation, kind: string, message: string): void =>
  console.log(`[${kind} error][operation: ${operation.operationName}]: ${message}`);

type MaybeToken = string | undefined;

/**
 * Create a link for adding authentication information
 */
export const createAuthenticationLink = (token: MaybeToken | Promise<MaybeToken>, domain: string): ApolloLink =>
  setContext(async (_request, { headers = {} }) => {
    headers['Event-Domain'] = domain;

    const resolvedToken = await token;
    if (resolvedToken) headers['Authorization'] = `Bearer ${resolvedToken}`;

    return { headers };
  });

const TYPE_POLICIES: TypePolicies = {
  Address: { keyFields: [] },
  CustomDomain: { keyFields: ['name'] },
  Event: { keyFields: ['slug'] },
  Identity: { keyFields: ['provider'] },
  Provider: { keyFields: ['slug'] },
};

/**
 * Create a cache with standard configuration
 */
export const createCache = (config?: Omit<InMemoryCacheConfig, 'typePolicies'>): InMemoryCache =>
  new InMemoryCache({ ...config, typePolicies: TYPE_POLICIES });
