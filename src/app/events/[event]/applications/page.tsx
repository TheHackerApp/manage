import { ReactNode } from 'react';

import List from './_components/List';

interface Props {
  params: { event: string };
}

const Applications = ({ params }: Props): ReactNode => (
  <div className="space-y-2">
    <h2 className="text-lg font-semibold">Applications</h2>
    <List event={params.event} />
  </div>
);

export default Applications;
