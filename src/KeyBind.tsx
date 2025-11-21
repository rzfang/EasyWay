import { KeyboardEvent, ReactNode, SyntheticEvent } from 'react';

import Datalist from './Datalist';
import useGuiAppsStore from './stores/gui-apps.store.ts';
import useRcStore from './stores/rc.store.ts';

const modifierKeyMap = [ 'A', 'C', 'S', 'W' ];

function OneBind ({ index }: {
  index: number;
}): ReactNode {
  const deleteBind = useRcStore(state => state.deleteBind);
  const item = useRcStore(state => state.config.keyboard.keybind[index]);
  const updateBindCommand = useRcStore(state => state.updateBindCommand);
  const updateBindKey = useRcStore(state => state.updateBindKey);
  const updateBindTo = useRcStore(state => state.updateBindTo);
  const updateBindType = useRcStore(state => state.updateBindType);

  const key = item['@_key'].split('-').find(key => (key !== '' && !modifierKeyMap.includes(key)));
  const modifiers = item['@_key'].split('-').filter(key => modifierKeyMap.includes(key));

  const changeModifiers = (event: SyntheticEvent<HTMLInputElement>) => {
    const checked = event.currentTarget.checked;
    const modifier = event.currentTarget.value;

    if (checked && !modifiers.includes(modifier)) {
      modifiers.push(modifier);
      modifiers.sort();
    } else if (!checked && modifiers.includes(modifier)) {
      modifiers.splice(modifiers.indexOf(modifier), 1);
    }

    updateBindKey(index, modifiers.join('-') + '-' + key);
  };

  const changeKey = (event: KeyboardEvent<HTMLInputElement>) => {
    let key = event.key;

    if (key === 'Enter') {
      key = 'Return';
    } else if (key === ' ') {
      key = 'Space';
    } else if (key.indexOf('Arrow') === 0) {
      key = key.replace('Arrow', '');
    }

    updateBindKey(index, modifiers.join('-') + '-' + key);
  };

  const changeType = (event: SyntheticEvent<HTMLSelectElement>) => {
    updateBindType(index, event.currentTarget.value);
  };

  const changeCommand = (event: SyntheticEvent<HTMLInputElement>) => {
    updateBindCommand(index, event.currentTarget.value);
  };

  const changeTo = (event: SyntheticEvent<HTMLSelectElement>) => {
    updateBindTo(index, event.currentTarget.value === 'left' ? 'left' : 'right');
  };

  return (
    <tr className="OneBind">
      <td>
        <label>
          <input
            checked={modifiers.includes('A')}
            name={`key0-${index}`}
            onChange={changeModifiers}
            type="checkbox"
            value="A"
          />
          <span>Alt</span>
        </label>
        <label>
          <input
            checked={modifiers.includes('C')}
            name={`key0-${index}`}
            onChange={changeModifiers}
            type="checkbox"
            value="C"
          />
          <span>Ctrl</span>
        </label>
        {/*<label>
          <input checked={modifiers.includes('H')} name={`key0-${index}`} onChange={changeModifiers} type="checkbox" value="H" />
          <span>Hyper</span>
        </label>
        <label>
          <input checked={modifiers.includes('M')} name={`key0-${index}`} onChange={changeModifiers} type="checkbox" value="M" />
          <span>Meta</span>
        </label>*/}
        <label>
          <input
            checked={modifiers.includes('S')}
            name={`key0-${index}`}
            onChange={changeModifiers}
            type="checkbox"
            value="S"
          />
          <span>Shift</span>
        </label>
        <label>
          <input
            checked={modifiers.includes('W')}
            name={`key0-${index}`}
            onChange={changeModifiers}
            type="checkbox"
            value="W"
          />
          <span>Super</span>
        </label><br />
        <input type="text" onChange={() => {}} onKeyUp={changeKey} placeholder={item['@_key']} value="" />
      </td>
      <td>
        <select defaultValue={item.action['@_name']} onChange={changeType}>
          <option value="Execute">Execute</option>
          <option value="GoToDesktop">GoToDesktop</option>
          <option value="ToggleAlwaysOnTop">ToggleAlwaysOnTop</option>
        </select>
        {item.action['@_name'] === 'Execute' && (
          <input
            defaultValue={item.action['@_command']}
            list="gui-apps-datalist"
            onChange={changeCommand}
            type="text"
          />
        ) || (item.action['@_name'] === 'ToggleAlwaysOnTop') && (
          <></>
        ) || (
          <select defaultValue={item.action['@_to']} onChange={changeTo}>
            <option value="left">left</option>
            <option value="right">right</option>
          </select>
        )}
      </td>
      <td><button onClick={() => deleteBind(index)}>❌</button></td>
    </tr>
  );
}

function KeyBind (): ReactNode {
  const addBind = useRcStore(state => state.addBind);
  const apps = useGuiAppsStore(state => state.apps).map(app => app.command);
  const keybinds = useRcStore(state => state.config.keyboard.keybind);
  const saveRc = useRcStore(state => state.save);

  const save = () => {
    const hints = [];

    if (keybinds.some(keybind => keybind['@_key'].indexOf('-') < 1)) {
      hints.push('at least one bind has no modifier key.');
    }

    if (keybinds.map(keybind => keybind['@_key']).some((key, index, keys) => keys.indexOf(key) !== index)) {
      hints.push('key duplicated between binds.');
    }

    if (keybinds.some(({ action }) => action['@_command'] === '')) {
      hints.push('at least one command not set yet.');
    }

    if (keybinds
      .filter(({ action }) => !!action['@_command'])
      .map(({ action }) => action['@_command'])
      .some((command, index, commands) => commands.indexOf(command) !== index)
    ) {
      hints.push('command duplicated between binds.');
    }

    if (hints.length > 0) {
      return alert('Oops, something wrong, please check following found.\n- ' + hints.join('\n- '));
    }

    saveRc();
  };

  return (
    <div className="KeyBind">
      <Datalist id="gui-apps-datalist" values={apps.filter(app => app !== '')} />
      <table>
        <thead>
          <tr>
            <th>Key</th>
            <th>Action</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {keybinds.map((item, index) => (<OneBind key={`${item['@_key']}-${index}`} index={index} />))}
        </tbody>
      </table>
      <div>
        <button onClick={addBind}>➕</button>
        <button onClick={save}>Save</button>
      </div>
    </div>
  );
}

export default KeyBind;
