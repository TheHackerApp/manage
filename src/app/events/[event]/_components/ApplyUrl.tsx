'use client';

import { faCopy } from '@fortawesome/pro-duotone-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Button, Input } from '@nextui-org/react';
import { ReactNode, useCallback } from 'react';
import toast from 'react-hot-toast';
import { useCopyToClipboard } from 'usehooks-ts';

const SCHEME = process.env.NODE_ENV === 'production' ? 'https' : 'http';

interface Props {
  domain: string;
}

const ApplyUrl = ({ domain }: Props): ReactNode => {
  const url = `${SCHEME}://${domain}`;

  const [_copiedText, copy] = useCopyToClipboard();
  const onPress = useCallback(async () => {
    await copy(url);
    toast.success('Copied portal URL to clipboard');
  }, [copy, url]);

  return (
    <Input
      className="max-w-md"
      label="Portal URL"
      value={domain}
      variant="bordered"
      isReadOnly={true}
      endContent={
        <Button className="flex-shrink-0" variant="light" isIconOnly onPress={onPress}>
          <FontAwesomeIcon icon={faCopy} className="text-default-500 h-6 w-6" />
        </Button>
      }
    />
  );
};

export default ApplyUrl;
