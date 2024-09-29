// import { message } from '@tauri-apps/api/dialog';

interface Props_I {
  items: {
    [string]: string;
  }[];
  onUpdate: () => void;
}

function AutoStart ({ items, onUpdate }: Props_I) {
  const itemList = Object.entries(items).map(([ key, value ]) => {
    let seconds = value.trim().match(/^sleep (\d+) &&/);

    return {
      command: value.trim().replace(/^sleep \d+ && /, ''),
      name: key,
      wait: seconds ? parseInt(seconds[1], 10) : 0,
    };
  });

  const updateSource = event => {
    const newItems = itemList.reduce(
      (whole, { command, name, wait }) => {
        whole[name] = wait ? `sleep ${wait} && ${command}` : command;

        return whole;
      },
      {}
    );

    onUpdate(event, newItems);
  };

  const nameUpdate = event => {
    const rootNode = event.currentTarget.parentNode.parentNode;

    const index = parseInt(rootNode.dataset.index, 10);
    const name = rootNode.querySelector('td:first-child>input[type=text]').value;

    if (!name) {
      return alert('no name.');
    }

    itemList[index].name = name;

    updateSource(event);
  }

  const waitingSecondUpdate = event => {
    const rootNode = event.currentTarget.parentNode.parentNode;

    const index = parseInt(rootNode.dataset.index, 10);
    const second = parseInt(rootNode.querySelector('td:nth-child(2)>input[type=number]').value, 10);

    if (second < 0) {
      return alert('waiting seconds can not be negative.');
    }

    if (second > 3600) {
      return alert('not allow to run a command 1 hour after boot.');
    }

    itemList[index].wait = second;

    updateSource(event);
  };

  const commandUpdate = event => {
    const rootNode = event.currentTarget.parentNode.parentNode;

    const command = rootNode.querySelector('td:nth-child(3)>input[type=text]').value.trim();
    const index = parseInt(rootNode.dataset.index, 10);

    if (!command) {
      return alert('no command!');
    }

    itemList[index].command = command;

    updateSource(event);
  };

  const commandDelete = event => {
    const rootNode = event.currentTarget.parentNode.parentNode;

    const index = parseInt(rootNode.dataset.index, 10);

    itemList.splice(index, 1);

    updateSource(event);
  };

  const commandAdd = event => {
    itemList.push({ command: 'echo "a_new_command."', name: Math.floor(Date.now() / 1000).toString(), wait: 0 });

    updateSource(event);
  };

  return (
    <fieldset className="AutoStart">
      <legend>Autostart commands/apps</legend>
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Waiting<br/>Seconds</th>
            <th>Command</th>
          </tr>
        </thead>
        <tbody>
          {itemList.map((item, index) => (
            <tr key={`${index}-${item.name}`} data-index={index}>
              <td><input type="text" defaultValue={item.name} onChange={nameUpdate} /></td>
              <td><input type="number" max="3600" min="0" onChange={waitingSecondUpdate} value={item.wait.toString()} /></td>
              <td><input type="text" defaultValue={item.command} onChange={commandUpdate} /></td>
              <td><button onClick={commandDelete}>Delete</button></td>
            </tr>
          ))}
          <tr>
            <td colSpan="3"><button onClick={commandAdd}>New command</button></td>
          </tr>
        </tbody>
      </table>
    </fieldset>
  );
}

export default AutoStart;
