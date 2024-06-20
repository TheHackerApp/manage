import { ReactNode } from 'react';
import { Toaster } from 'react-hot-toast';

import { ApolloClientProvider } from '@/graphql/client';

import NextUIProvider from './NextUIProvider';
import ThemeProvider from './ThemeProvider';

interface Props {
  children: ReactNode;
}

const Providers = ({ children }: Props): ReactNode => (
  <ApolloClientProvider>
    <NextUIProvider>
      <ThemeProvider>
        {children}
        <Toaster position="top-right" toastOptions={{ className: 'toast' }} />
      </ThemeProvider>
    </NextUIProvider>
  </ApolloClientProvider>
);

export default Providers;
