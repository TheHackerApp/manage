import { Card, CardBody, CardHeader, Divider } from '@nextui-org/react';
import { ReactNode } from 'react';

const MaintenanceCard = (): ReactNode => (
  <main className="max-w-3xl mx-auto mt-24">
    <Card>
      <CardHeader className="text-2xl font-bold">System undergoing maintenance</CardHeader>
      <Divider />
      <CardBody>This website is currently undergoing prolonged maintenance. Please check back later.</CardBody>
    </Card>
  </main>
);

export default MaintenanceCard;
