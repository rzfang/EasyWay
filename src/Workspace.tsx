import { ReactNode, SyntheticEvent } from 'react';

import useRcStore from './stores/rc.store.ts';

function Workspace (): ReactNode {
  const number = useRcStore(state => state.config.desktops['@_number']);
  const saveRc = useRcStore(state => state.save);
  const updateWorkspaceNumber = useRcStore(state => state.updateWorkspaceNumber);

  const changeNumber = (event: SyntheticEvent<HTMLInputElement>) => {
    updateWorkspaceNumber(event.currentTarget.value);
  };

  const save = () => {
    const hints = [];

    if (number < 1) {
      hints.push('workspace must be at least 1.');
    }

    if (number > 10) {
      hints.push('workspace can only max to 10.');
    }

    if (hints.length > 0) {
      return alert('Oops, something wrong, please check following found.\n- ' + hints.join('\n- '));
    }

    saveRc();
  };

  return (
    <div className="Workspace">
      <div>
        <input type="number" max="10" min="1" defaultValue={number} onChange={changeNumber} />
        <span>Hint: go to "Hotkeys" to set up the key bind and workspace switching.</span>
      </div>
      <div>
        <button onClick={save}>Save</button>
      </div>
    </div>
  );
}

export default Workspace;
