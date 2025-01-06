import { ReactNode, useState } from 'react';

import useRcStore from './stores/rc.store.ts';

interface Item_I {
  '@_key': string;
  action: {
    '@_command': string;
  };
}

interface OneBindProps_I {
  index: number;
}

const modifierKeyMap = [ 'A', 'C', 'S', 'W' ];

function OneBind ({ index }: OneBindProps_I): ReactNode {
  const deleteBind = useRcStore(state => state.deleteBind);
  const item: Item_I = useRcStore(state => state.config.keyboard.keybind[index]);
  const updateBindCommand = useRcStore(state => state.updateBindCommand);
  const updateBindKey = useRcStore(state => state.updateBindKey);

  const key = item['@_key'].split('-').find(key => (key !== '' && !modifierKeyMap.includes(key)));
  const modifiers = item['@_key'].split('-').filter(key => modifierKeyMap.includes(key));

  const changeModifiers = event => {
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

  const changeKey = event => {
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

  const changeCommand = event => {
    updateBindCommand(index, event.currentTarget.value);
  };

  return (
    <tr className="OneBind">
      <td>
        <label>
          <input checked={modifiers.includes('A')} name={`key0-${index}`} onChange={changeModifiers} type="checkbox" value="A" />
          <span>Alt</span>
        </label>
        <label>
          <input checked={modifiers.includes('C')} name={`key0-${index}`} onChange={changeModifiers} type="checkbox" value="C" />
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
          <input checked={modifiers.includes('S')} name={`key0-${index}`} onChange={changeModifiers} type="checkbox" value="S" />
          <span>Shift</span>
        </label>
        <label>
          <input checked={modifiers.includes('W')} name={`key0-${index}`} onChange={changeModifiers} type="checkbox" value="W" />
          <span>Super</span>
        </label><br />
        <input type="text" onChange={() => {}} onKeyUp={changeKey} placeholder={item['@_key']} value="" />
      </td>
      <td><input type="text" defaultValue={item.action['@_command']} onChange={changeCommand} /></td>
      <td><button onClick={() => deleteBind(index)}>Delete</button></td>
    </tr>
  );
}

function KeyBind (): ReactNode {
  const [ timeStamp, setTimeStamp ] = useState<number>(Date.now());
  const addBind = useRcStore(state => state.addBind);
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
      <table>
        <thead>
          <tr>
            <th>Key</th>
            <th>Command</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {keybinds.map((item, index) => (<OneBind key={`${item['@_key']}-${index}`} index={index} item={item} />))}
        </tbody>
      </table>
      <button onClick={addBind}>Add</button>
      <button onClick={save}>Save</button>
    </div>
  );
}

export default KeyBind;
