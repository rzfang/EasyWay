import { ReactNode } from 'react';

function Datalist ({ className = '', id, values }: {
  className?: string;
  id: string;
  values: string[];
}): ReactNode {
  return (
    <datalist className={`Datalist ${id} ${className}`} id={id}>
      {values.map(value => (<option key={value} value={value} />))}
    </datalist>
  );
}

export default Datalist;
