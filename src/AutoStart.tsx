import { ReactNode } from 'react';

import useAsStore from './stores/autostart.store.ts';

function AutoStart (): ReactNode {
  const addOne = useAsStore(state => state.addOne);
  const deleteOne = useAsStore(state => state.deleteOne);
  const items = useAsStore(state => state.items);
  const updateOne = useAsStore(state => state.updateOne);

  const commandUpdate = event => {
    const command = event.currentTarget.value.trim();
    const rootNode = event.currentTarget.parentNode.parentNode;

    const index = parseInt(rootNode.dataset.index, 10);

    if (!command) {
      return alert('no command!');
    }

    updateOne(index, command);
  };

  const commandDelete = event => {
    const rootNode = event.currentTarget.parentElement.parentElement;

    const index = parseInt(rootNode.dataset.index, 10);

    deleteOne(index);
  };

  const commandAdd = event => {
    addOne();
  };

  return (
    <table className="AutoStart">
      <thead>
        <tr>
          <th>Command</th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        {items.map((item, index) => (
          <tr key={`${item}-${index}`} data-index={index}>
            <td><input type="text" defaultValue={item} onChange={commandUpdate} /></td>
            <td><button onClick={commandDelete}>Delete</button></td>
          </tr>
        ))}
        <tr>
          <td colSpan="3"><button onClick={commandAdd}>New command</button></td>
        </tr>
      </tbody>
    </table>
  );
}

export default AutoStart;
