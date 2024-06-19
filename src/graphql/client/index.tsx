import { cookies, headers } from 'next/headers';
import { PropsWithChildren, ReactNode } from 'react';

import { cloakSsrOnly } from '@/lib/ssr-secret';

import { ClientSideProvider } from './impl';

export const ApolloClientProvider = ({ children }: PropsWithChildren): ReactNode => {
  const cookieJar = cookies();
  const token = cookieJar.get('session');

  const requestHeaders = headers();
  const domain = requestHeaders.get('host');
  if (domain === null) throw new Error('request must have a "host" header');

  return (
    <ClientSideProvider token={cloakSsrOnly(token?.value)} domain={domain}>
      {children}
    </ClientSideProvider>
  );
};
