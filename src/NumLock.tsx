import { ReactNode } from 'react';

import useRcStore from './stores/rc.store.ts';

function NumLock (): ReactNode {
  const isNumlock = useRcStore(state => state.config.keyboard.numlock) === 'on';
  const saveRc = useRcStore(state => state.save);
  const toggleNumLock = useRcStore(state => state.toggleNumLock);

  const save = () => {
    saveRc();
  };

  return (
    <div className="NumLock">
      <label>
        On
        <input name="on-off" checked={isNumlock} onChange={toggleNumLock} type="radio" value="on" />
      </label>
      <label>
        Off
        <input name="on-off" checked={!isNumlock} onChange={toggleNumLock} type="radio" value="off" />
      </label>
      <div>
        <button onClick={save}>Save</button>
      </div>
    </div>
  );
}

export default NumLock;
