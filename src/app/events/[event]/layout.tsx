import { PropsWithChildren, ReactNode } from 'react';

import Header from '@/app/events/[event]/_components/Header';

interface Props {
  params: { event: string };
}

const Layout = ({ children, params }: PropsWithChildren<Props>): ReactNode => (
  <div className="mx-auto max-w-5xl">
    <Header event={params.event} />

    <main className="mt-8">{children}</main>
  </div>
);

export default Layout;
