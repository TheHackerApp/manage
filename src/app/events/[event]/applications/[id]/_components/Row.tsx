import { ReactNode } from 'react';

interface Props<T extends ReactNode> {
  label: string;
  value?: T | null;
  render?: (value: T) => ReactNode;
}

const Row = <T extends ReactNode>({ label, value, render = (value) => value }: Props<T>): ReactNode => (
  <div className="grid grid-cols-2">
    <p className="font-medium">{label}</p>
    <p className="font-light">{value !== null && value !== undefined && render(value)}</p>
  </div>
);

export default Row;
