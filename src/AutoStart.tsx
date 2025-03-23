import { ReactNode, SyntheticEvent } from 'react';

import useAsStore from './stores/autostart.store.ts';

interface CommandProps_I {
  index: number;
}

function Command ({ index }: CommandProps_I): ReactNode {
  const changeOrder = useAsStore(state => state.changeOrder);
  const command = useAsStore(state => state.items[index].command);
  const deleteOne = useAsStore(state => state.deleteOne);
  const updateOne = useAsStore(state => state.updateOne);

  const commandChangeOrder = (event: SyntheticEvent<HTMLButtonElement>) => {
    const order = parseInt(event.currentTarget.value, 10);

    changeOrder(index, order);
  };

  const commandUpdate = (event: SyntheticEvent<HTMLInputElement>) => {
    const command = event.currentTarget.value.trim();

    if (!command) {
      return alert('no command!');
    }

    updateOne(index, command);
  };

  const commandDelete = () => {
    deleteOne(index);
  };

  return (
    <tr className="Command">
      <td><input type="text" defaultValue={command} onChange={commandUpdate} /></td>
      <td>
        <button onClick={commandChangeOrder} value="-1">⬆️</button>
        <button onClick={commandChangeOrder} value="1">⬇️</button>
        <button onClick={commandDelete}>❌</button>
      </td>
    </tr>
  );
}

function AutoStart (): ReactNode {
  const addOne = useAsStore(state => state.addOne);
  const asSave = useAsStore(state => state.save);
  const items = useAsStore(state => state.items);

  const commandAdd = () => {
    addOne();
  };

  const save = () => {
    const hints = [];

    if (items.some(({ command }) => !command)) {
      hints.push('one or many command are empty.');
    }

    if (hints.length > 0) {
      return alert('Oops, something wrong, please check following found.\n- ' + hints.join('\n- '));
    }

    asSave();
  };

  return (
    <div className="AutoStart">
      <table>
        <thead>
          <tr>
            <th>Command</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {items.map(({ id }, index) => (<Command key={id} index={index} />))}
        </tbody>
      </table>
      <div>
        <button onClick={commandAdd}>➕</button>
        <button onClick={save}>Save</button>
      </div>
    </div>
  );
}

export default AutoStart;
