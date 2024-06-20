'use client';

import { faArrowUpRightFromSquare } from '@fortawesome/pro-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Button, Table, TableBody, TableCell, TableColumn, TableHeader, TableRow } from '@nextui-org/react';
import Link from 'next/link';
import { ReactNode } from 'react';

import DateTime from '@/components/DateTime';
import Status from '@/components/Status';

import { useApplicationsSuspenseQuery } from './Applications.graphql';

interface Props {
  event: string;
}

const List = ({ event }: Props): ReactNode => {
  const { data } = useApplicationsSuspenseQuery({ context: { event } });

  return (
    <Table aria-label="All the applications">
      <TableHeader>
        <TableColumn>NAME</TableColumn>
        <TableColumn>EMAIL</TableColumn>
        <TableColumn>STATUS</TableColumn>
        <TableColumn>APPLIED AT</TableColumn>
        <TableColumn>
          <span className="sr-only">Actions</span>
        </TableColumn>
      </TableHeader>
      <TableBody>
        {data.applications.map((application) => (
          <TableRow key={application.participant.user.id}>
            <TableCell>
              {application.participant.user.givenName} {application.participant.user.familyName}
            </TableCell>
            <TableCell>{application.participant.user.primaryEmail}</TableCell>
            <TableCell>
              <Status status={application.status} />
            </TableCell>
            <TableCell>
              <DateTime value={application.createdAt} />
            </TableCell>
            <TableCell>
              <div className="relative flex justify-end items-center gap-2">
                <Button
                  as={Link}
                  href={`/events/${event}/applications/${application.participant.user.id}`}
                  variant="light"
                  isIconOnly
                >
                  <FontAwesomeIcon icon={faArrowUpRightFromSquare} className="text-default-500 h-5 w-5" />
                </Button>
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default List;
