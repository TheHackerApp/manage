'use client';

import { ReactNode } from 'react';

interface Props {
  error: Error;
  reset: () => void;
}

const Error = ({ error }: Props): ReactNode => {
  console.log(error);

  return <>{error.message}</>;
};

export default Error;
