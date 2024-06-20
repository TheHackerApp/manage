import { Chip } from '@nextui-org/react';
import { ReactNode } from 'react';

import { ApplicationStatus } from '@/graphql';

interface Props {
  status: ApplicationStatus;
}

const Status = ({ status }: Props): ReactNode => (
  <Chip color={colorForStatus(status)}>{status.charAt(0) + status.slice(1).toLowerCase()}</Chip>
);

const colorForStatus = (status: ApplicationStatus): 'warning' | 'default' | 'success' | 'danger' => {
  switch (status) {
    case ApplicationStatus.Pending:
      return 'warning';
    case ApplicationStatus.Waitlisted:
      return 'default';
    case ApplicationStatus.Accepted:
      return 'success';
    case ApplicationStatus.Rejected:
      return 'danger';
    default:
      throw new Error('Unknown status');
  }
};

export default Status;
