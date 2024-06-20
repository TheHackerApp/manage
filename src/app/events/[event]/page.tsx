import { Button } from '@nextui-org/react';
import Link from 'next/link';
import { ReactNode } from 'react';

interface Props {
  params: { event: string };
}

const Event = ({ params }: Props): ReactNode => (
  <>
    <Button as={Link} href={params.event + '/applications'}>
      View Applications
    </Button>
  </>
);

export default Event;
