import { ReactNode, SyntheticEvent } from 'react';

import Datalist from './Datalist';
import useGuiAppsStore from './stores/gui-apps.store.ts';
import useWfPanelPiStore from './stores/wf-panel-pi.store.ts';

function Launcher (): ReactNode {
  const addLauncher = useWfPanelPiStore(state => state.addLauncher);
  const apps = useGuiAppsStore(state => state.apps);
  const changeLaucherOrder = useWfPanelPiStore(state => state.changeLaucherOrder);
  const launchers = useWfPanelPiStore(state => state.launchers);
  const removeLauncher = useWfPanelPiStore(state => state.removeLauncher);
  const saveLaunchers = useWfPanelPiStore(state => state.saveLaunchers);
  const updateLauncher = useWfPanelPiStore(state => state.updateLauncher);

  const update = (event: SyntheticEvent<HTMLInputElement>) => {
    const index = event.currentTarget.parentElement?.parentElement?.dataset.index;

    if (!index) {
      return;
    }

    updateLauncher(parseInt(index, 10), event.currentTarget.value);
  };

  const remove = (event: SyntheticEvent<HTMLButtonElement>) => {
    const index = event.currentTarget.parentElement?.parentElement?.dataset.index;

    if (!index) {
      return;
    }

    removeLauncher(parseInt(index, 10));
  };

  const changeOrder = (event: SyntheticEvent<HTMLButtonElement>) => {
    const index = event.currentTarget.parentElement?.parentElement?.dataset.index;
    const order = event.currentTarget.value;

    if (!index) {
      return;
    }

    changeLaucherOrder(parseInt(index, 10), parseInt(order, 10));
  };

  const save = () => {
    const hints = [];

    if (launchers.some(({ app }) => app.trim() === '')) {
      hints.push('at least one app not set yet.');
    }

    if (hints.length > 0) {
      return alert('Oops, something wrong, please check following found.\n- ' + hints.join('\n- '));
    }

    saveLaunchers();
  };

  return (
    <div className="Launcher">
      <Datalist id="gui-apps-datalist" values={apps.map(app => app.file)} />
      <table>
        <thead>
          <tr>
            <th>App</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {launchers.map(({ app, id }, index) => (
            <tr key={id} data-index={index}>
              <td><input type="text" defaultValue={app} list="gui-apps-datalist" onChange={update}/></td>
              <td>
                <button onClick={changeOrder} value="-1">⬆️</button>
                <button onClick={changeOrder} value="1">⬇️</button>
                <button onClick={remove}>❌</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div>
        <button onClick={addLauncher}>➕</button>
        <button onClick={save}>Save</button>
      </div>
    </div>
  );
}

export default Launcher;
