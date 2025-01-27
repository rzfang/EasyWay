import { ReactNode } from 'react';

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

  const update = event => {
    const index = parseInt(event.currentTarget.parentElement.parentElement.dataset.index, 10);

    updateLauncher(index, event.currentTarget.value);
  };

  const remove = event => {
    const index = parseInt(event.currentTarget.parentElement.parentElement.dataset.index, 10);

    removeLauncher(index);
  };

  const changeOrder = event => {
    const index = parseInt(event.currentTarget.parentElement.parentElement.dataset.index, 10);
    const order = parseInt(event.currentTarget.value, 10);

    changeLaucherOrder(index, order);
  };

  const save = event => {
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
              <td><input type="text" defaultValue={app} onChange={update} /></td>
              <td>
                <button onClick={changeOrder} value="-1">⬆️</button>
                <button onClick={changeOrder} value="1">⬇️</button>
                <button onClick={remove}>❌</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <button onClick={addLauncher}>➕</button>
      <button onClick={save}>Save</button>
    </div>
  );
}

export default Launcher;
