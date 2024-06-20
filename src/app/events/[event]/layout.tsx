'use client';

import { Chip, Tooltip } from '@nextui-org/react';
import { PropsWithChildren, ReactNode } from 'react';

import ApplyUrl from '@/app/events/[event]/_components/ApplyUrl';
import { useEventSuspenseQuery } from '@/app/events/[event]/Event.graphql';

interface Props {
  params: { event: string };
}

const Layout = ({ children, params }: PropsWithChildren<Props>): ReactNode => {
  const { data } = useEventSuspenseQuery({ variables: params, context: params });

  const event = data.event!;
  const expiresOn = new Date(event.expiresOn);

  return (
    <div className="mx-auto max-w-5xl">
      <div className="flex items-center justify-between p-4 lg:px-0">
        <h1 className="text-3xl font-bold">{event.name}</h1>
        <Tooltip content={'Until ' + expiresOn.toLocaleDateString()}>
          <Chip color={event.active ? 'secondary' : 'danger'}>{event.active ? 'Active' : 'Inactive'}</Chip>
        </Tooltip>
      </div>
      <ApplyUrl domain={event.domain} />

      <main className="mt-8">{children}</main>
    </div>
  );
};

export default Layout;
