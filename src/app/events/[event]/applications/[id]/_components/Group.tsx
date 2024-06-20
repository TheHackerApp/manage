import { Card, CardBody, CardHeader, Divider } from '@nextui-org/react';
import { PropsWithChildren, ReactNode } from 'react';

interface Props {
  name: string;
}

const Group = ({ children, name }: PropsWithChildren<Props>): ReactNode => (
  <Card shadow="sm">
    <CardHeader className="flex justify-between">
      <h3 className="text-large font-semibold">{name}</h3>
    </CardHeader>
    <Divider />
    <CardBody className="space-y-1.5">{children}</CardBody>
  </Card>
);

export default Group;
