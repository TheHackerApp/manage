'use client';

import { ApolloNextAppProvider } from '@apollo/experimental-nextjs-app-support';
import { PropsWithChildren, ReactNode } from 'react';

import { makeCsrClient, makeSsrClient } from './clients';
import type { ClientCreator } from './clients';

interface Props {
  token: Promise<string | undefined>;
  domain: string;
}

export const ClientSideProvider = ({ children, token, domain }: PropsWithChildren<Props>): ReactNode => {
  const makeClient: ClientCreator = typeof window === 'undefined' ? makeSsrClient : makeCsrClient;
  return <ApolloNextAppProvider makeClient={() => makeClient({ token, domain })}>{children}</ApolloNextAppProvider>;
};
