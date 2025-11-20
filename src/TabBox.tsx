import classnames from 'classnames';
import { ReactNode, useState } from 'react';

function TabBox ({ center = false, defaultIndex = 0, tabs }: {
  center?: boolean;
  defaultIndex?: number;
  tabs: {
    label: ReactNode;
    content: ReactNode;
  }[];
}): ReactNode {
  const [ tabIndex, setTabIndex ] = useState<number>(defaultIndex);

  return (
    <div className={classnames('TabBox', center ? 'center' : '')}>
      <ul className="label-box">
        {tabs.map(({ label }, index) => (
          <li
            className={index === tabIndex ? 'selected' : ''}
            key={index}
            onClick={index !== tabIndex ? () => setTabIndex(index) : undefined}
          >
            {label}
          </li>
        ))}
      </ul>
      <div className="content-box">{tabs[tabIndex]?.content}</div>
    </div>
  );
}

export default TabBox;
