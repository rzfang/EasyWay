import { ReactNode } from 'react';

interface Props_I {
  className?: string;
  id: string;
  values: string[];
}

function Datalist ({ className = '', id, values }: Props_I): ReactNode {
  return (
    <datalist className={`Datalist ${id} ${className}`} id={id}>
      {values.map(value => (<option key={value} value={value} />))}
    </datalist>
  );
}

export default Datalist;
