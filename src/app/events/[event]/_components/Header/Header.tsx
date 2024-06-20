'use client';

import { Chip, Tooltip } from '@nextui-org/react';
import { ReactNode } from 'react';

import ApplyUrl from './components/ApplyUrl';
import { useEventSuspenseQuery } from './Event.graphql';

interface Props {
  event: string;
}

const Header = ({ event }: Props): ReactNode => {
  const { data } = useEventSuspenseQuery({ variables: { event }, context: { event } });

  const { active, domain, expiresOn, name } = data.event!;
  const tooltipContent = 'Until ' + new Date(expiresOn).toLocaleDateString();

  return (
    <>
      <div className="flex items-center justify-between p-4 lg:px-0">
        <h1 className="text-3xl font-bold">{name}</h1>
        <Tooltip content={tooltipContent}>
          <Chip color={active ? 'secondary' : 'danger'}>{active ? 'Active' : 'Inactive'}</Chip>
        </Tooltip>
      </div>
      <ApplyUrl domain={domain} />
    </>
  );
};

export default Header;
