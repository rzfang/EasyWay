import "./App.css";

import { BaseDirectory, exists, readTextFile, writeTextFile } from '@tauri-apps/plugin-fs';
import { useEffect, useState } from "react";
import { XMLParser, XMLBuilder, XMLValidator } from 'fast-xml-parser';

import AutoStart from './AutoStart';
import KeyBind from './KeyBind';
import NumLock from './NumLock';
import useRcStore from './stores/rc.store.ts';

function App () {
  // const [ rcConfig, setRcConfig ] = useState({});
  const [ tab, setTab ] = useState('');
  const rcConfig = useRcStore(state => state.config);
  const saveRc = useRcStore(state => state.save);

  const switchTab = (event) => {
    setTab(event.currentTarget.value);
  };

  const save = () => {
    // const newKeybind = Array
    //   .from(document.querySelectorAll('.App .KeyBind tbody tr') || [])
    //   .map(tr => {
    //     const [ key, command ] = Array.from(tr.querySelectorAll('input[type=text]') || []);

    //     return {
    //       '@_key': key.placeholder,
    //       action: { '@_name': 'Execute', '@_command': command.value }, // @_name can not be after @_command, or labwc can not understand.
    //     };
    //   });

    // const commands = newKeybind.map(({ action }) => action['@_command']);
    // const keys = newKeybind.map(oneBind => oneBind['@_key']);
    const hints = [];
    const { keybind } = rcConfig.keyboard;

    if (keybind.some(keybind => keybind['@_key'].indexOf('-') < 1)) {
      hints.push('at least one bind has no modifier key.');
    }

    if (keybind.map(keybind => keybind['@_key']).some((key, index, keys) => keys.indexOf(key) !== index)) {
      hints.push('key duplicated between binds.');
    }

    if (keybind.some(({ action }) => action['@_command'] === '')) {
      hints.push('at least one command not set yet.');
    }

    if (keybind
      .map(({ action }) => action['@_command'])
      .some((command, index, commands) => commands.indexOf(command) !== index)
    ) {
      hints.push('command duplicated between binds.');
    }

    if (hints.length > 0) {
      return alert('Oops, something wrong, please check following found.\n- ' + hints.join('\n- '));
    }

    // if (rcConfig.keyboard) {
    //   rcConfig.keyboard.keybind = newKeybind;
    // } else {
    //   rcConfig.keyboard = { keybind: newKeybind };
    // }

    // const builder = new XMLBuilder({ format: true, ignoreAttributes: false });

    // const xmlContent = '<?xml version="1.0"?>\n' +
    //   builder.build({ labwc_config: rcConfig }).replace(/><\/action>/g, ' />');

    // writeTextFile('.config/labwc/rc.xml', xmlContent, { dir: BaseDirectory.Home })
    //   .catch(error => console.error(error))
    //   .then(error => { alert(error || 'config saved.'); });

    saveRc(rcConfig);
  };

  return (
    <div className="App">
      <header>
        <nav>
          <button disabled={tab === 'numlock'} value="numlock" onClick={switchTab}>NumLock on/off</button>
          <button disabled={tab === 'hotkeys'} value="hotkeys" onClick={switchTab}>Hotkeys</button>
          <button disabled={tab === 'autostart'} value="autostart" onClick={switchTab}>Autostart</button>
        </nav>
      </header>
      <main>
        {
          tab === 'numlock' && (<NumLock />) ||
          tab === 'hotkeys' && (<KeyBind />) ||
          tab === 'autostart' && (<AutoStart />)
        }
      </main>
      <footer>
        <button onClick={save}>Save</button>
      </footer>
    </div>
  );
}

export default App;
