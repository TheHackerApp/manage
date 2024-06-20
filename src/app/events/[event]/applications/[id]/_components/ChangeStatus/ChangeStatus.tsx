'use client';

import { Button, Select, SelectItem } from '@nextui-org/react';
import { useCallback, useMemo } from 'react';
import toast from 'react-hot-toast';

import { ApplicationStatus } from '@/graphql';

import { useChangeApplicationStatusMutation } from './ChangeApplicationStatus.graphql';

interface Props {
  id: number;
  event: string;
  current: ApplicationStatus;
}

const ChangeStatus = ({ id, event, current }: Props) => {
  const [mutate, { loading }] = useChangeApplicationStatusMutation({ context: { event } });

  const items = useMemo(() => {
    const options = [
      { key: ApplicationStatus.Accepted, label: 'Accept' },
      { key: ApplicationStatus.Rejected, label: 'Reject' },
    ];

    if (current === ApplicationStatus.Pending)
      options.unshift({ key: ApplicationStatus.Waitlisted, label: 'Waitlist' });

    return options;
  }, [current]);

  const onSubmit = useCallback(
    async (form: FormData) => {
      const values = Object.fromEntries(form);

      const { data } = await mutate({ variables: { input: { id, status: values.status as ApplicationStatus } } });

      const userErrors = data?.changeApplicationStatus.userErrors || [];
      if (userErrors.length > 0) {
        for (const error of userErrors) toast.error(error.message);
      } else {
        toast.success('Application status updated!.');
      }
    },
    [mutate, id],
  );

  return (
    <form className="grid grid-cols-3 gap-4 items-center" action={onSubmit}>
      <Select label="Decision" name="status" className="col-span-2" isRequired isDisabled={loading} items={items}>
        {(item) => <SelectItem key={item.key}>{item.label}</SelectItem>}
      </Select>
      <div>
        <Button type="submit" variant="ghost" color="secondary" isLoading={loading}>
          Save
        </Button>
      </div>
    </form>
  );
};

export default ChangeStatus;
