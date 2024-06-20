'use client';

import { DateFormatter } from '@internationalized/date';
import { ReactNode } from 'react';

interface Props {
  value: string;
  time?: boolean;
}

const DateTime = ({ value, time = true }: Props): ReactNode => {
  const timestamp = new Date(value);

  const language = typeof window !== 'undefined' ? window.navigator.language : 'en';
  return new DateFormatter(language, { dateStyle: 'long', timeStyle: time ? 'short' : undefined }).format(timestamp);
};

export default DateTime;
