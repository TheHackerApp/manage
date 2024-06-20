'use client';

import { DateFormatter } from '@internationalized/date';
import { ReactNode } from 'react';

interface Props {
  value: string;
}

const DateTime = ({ value }: Props): ReactNode => {
  const timestamp = new Date(value);

  const language = typeof window !== 'undefined' ? window.navigator.language : 'en';
  return new DateFormatter(language, { dateStyle: 'long', timeStyle: 'short' }).format(timestamp);
};

export default DateTime;
