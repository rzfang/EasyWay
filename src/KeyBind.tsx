import { ReactNode, useState } from 'react';

interface Item_I {
  '@_key': string;
  action: {
    '@_command': string;
  };
}

interface OneBindProps_I {
  index: number;
  item: Item_I;
  onDelete: () => void;
}

const modifierKeyMap = [ 'A', 'C', 'S', 'W' ];

function OneBind ({ index, item, onDelete }: OneBindProps_I): ReactNode {
  const [ modifiers, setModifiers ] = useState(item['@_key'].split('-').filter(key => modifierKeyMap.includes(key)));
  const [ key, setKey ] = useState(item['@_key'].split('-').find(key => !modifierKeyMap.includes(key)));

  const updateModifiers = event => {
    const checked = event.currentTarget.checked;
    const modifier = event.currentTarget.value;

    if (checked && !modifiers.includes(modifier)) {
      modifiers.push(modifier);
      modifiers.sort();

      setModifiers([ ...modifiers ]);
    } else if (!checked && modifiers.includes(modifier)) {
      modifiers.splice(modifiers.indexOf(modifier), 1);

      setModifiers([ ...modifiers ]);
    }
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

    setKey(key);
  };

  const deleteThis = event => {
    onDelete(event, index);
  }

  return (
    <tr className="OneBind">
      <td>
        <label>
          <input checked={modifiers.includes('A')} name={`key0-${index}`} onChange={updateModifiers} type="checkbox" value="A" />
          <span>Alt</span>
        </label>
        <label>
          <input checked={modifiers.includes('C')} name={`key0-${index}`} onChange={updateModifiers} type="checkbox" value="C" />
          <span>Ctrl</span>
        </label>
        {/*<label>
          <input checked={modifiers.includes('H')} name={`key0-${index}`} onChange={updateModifiers} type="checkbox" value="H" />
          <span>Hyper</span>
        </label>
        <label>
          <input checked={modifiers.includes('M')} name={`key0-${index}`} onChange={updateModifiers} type="checkbox" value="M" />
          <span>Meta</span>
        </label>*/}
        <label>
          <input checked={modifiers.includes('S')} name={`key0-${index}`} onChange={updateModifiers} type="checkbox" value="S" />
          <span>Shift</span>
        </label>
        <label>
          <input checked={modifiers.includes('W')} name={`key0-${index}`} onChange={updateModifiers} type="checkbox" value="W" />
          <span>Super</span>
        </label><br />
        <input type="text" onChange={() => {}} onKeyUp={changeKey} placeholder={modifiers.join('-') + '-' + key} value="" />
      </td>
      <td><input type="text" defaultValue={item.action['@_command']} /></td>
      <td><button onClick={deleteThis}>Delete</button></td>
    </tr>
  );
}

interface Props_I {
  keybind: Item_I[];
}

function KeyBind ({ keybind }: Props_I): ReactNode {
  const [ timeStamp, setTimeStamp ] = useState<number>(Date.now());

  const deleteBind = (event, index) => {
    keybind.splice(index, 1);

    setTimeStamp(Date.now());
  };

  const addBind = () => {
    keybind.push({
      '@_key': 'W-a',
      action: { '@_command': '' },
    });

    setTimeStamp(Date.now());
  };

  return (
    <div className="KeyBind">
      <table>
        <thead>
          <tr>
            <th>Key</th>
            <th>Command</th>
            <th>Delete</th>
          </tr>
        </thead>
        <tbody>
          {keybind.map((item, index) => (
            <OneBind key={`${item['@_key']}-${index}`} onDelete={deleteBind} index={index} item={item} />
          ))}
        </tbody>
      </table>
      <button onClick={addBind}>Add</button>
    </div>
  );
}

export default KeyBind;
