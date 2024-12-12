import "./App.css";

import { BaseDirectory, exists, readTextFile, writeTextFile } from '@tauri-apps/plugin-fs';
import { useEffect, useState } from "react";
import { XMLParser, XMLBuilder, XMLValidator } from 'fast-xml-parser';

import AutoStart from './AutoStart';
import KeyBind from './KeyBind';
import NumLock from './NumLock';

function App () {
  const [ autostarts, setAutostarts ] = useState([]);
  const [ rcConfig, setRcConfig ] = useState({});
  const [ timestamp, setTimestamp ] = useState(Date.now());

  useEffect(() => {
    exists('.config/labwc/rc.xml', { baseDir: BaseDirectory.Home })
      .catch(error => console.error(error) && Promise.reject(error))
      .then(existing => {
        if (!existing) {
          setRcConfig({});

          return;
        }

        readTextFile('.config/labwc/rc.xml', { baseDir: BaseDirectory.Home })
          .catch(error => console.error(error) && Promise.reject(error))
          .then(text => {
            if (!text) {
              return alert('weird rc.xml?');
            }

            const parser = new XMLParser({ ignoreAttributes : false });

            const rootConfig = parser.parse(text);

            const rcConfig = rootConfig?.openbox_config || rootConfig?.labwc_config;

            if (!rcConfig) {
              return alert('weird rc.xml?');
            }

            setRcConfig(rcConfig);
          });
      });

    // readTextFile('.config/labwc/autostart', { dir: BaseDirectory.Home })
    //   .catch(error => console.error(error))
    //   .then(text => {
    //     if (!text) {
    //       return alert('weird autoStart file?');
    //     }

    //     console.log(text.split('&\n'));
    //   });
  }, [ timestamp ]);

  const setNumLockOnOff = (event, onOff) => {
    if (rcConfig.keyboard) {
      rcConfig.keyboard.numlock = onOff;
    } else {
      rcConfig.keyboard = { numlock: onOff };
    }
  };

  const updateAutoStartItems = (event, items) => {
    if (!rcConfig.autostart) {
      rcConfig.autostart = {};
    }

    rcConfig.autostart = items;

    setRcConfig({ ...rcConfig });
  };

  const reload = () => {
    setTimestamp(Date.now());
  };

  const save = () => {
    const newKeybind = Array
      .from(document.querySelectorAll('.App .KeyBind tbody tr') || [])
      .map(tr => {
        const [ key, command ] = Array.from(tr.querySelectorAll('input[type=text]') || []);

        return {
          '@_key': key.placeholder,
          action: { '@_name': 'Execute', '@_command': command.value }, // @_name can not be after @_command, or labwc can not understand.
        };
      });

    const commands = newKeybind.map(({ action }) => action['@_command']);
    const keys = newKeybind.map(oneBind => oneBind['@_key']);
    const hints = [];

    if (keys.find(key => key.indexOf('-') < 0)) {
      hints.push('at least  one bind has no modifier key.');
    }

    if (!!keys.find((key, index, keys) => keys.indexOf(key) !== index)) {
      hints.push('key duplicated between binds.');
    }

    if (commands.indexOf('') > -1) {
      hints.push('at least one command not set yet.');
    }

    if (!!commands.find((command, index, commands) => commands.indexOf(command) !== index)) {
      hints.push('command duplicated between binds.');
    }

    if (hints.length > 0) {
      return alert('Oops, something wrong, please check following found.\n- ' + hints.join('\n- '));
    }

    if (rcConfig.keyboard) {
      rcConfig.keyboard.keybind = newKeybind;
    } else {
      rcConfig.keyboard = { keybind: newKeybind };
    }

    const builder = new XMLBuilder({ format: true, ignoreAttributes: false });

    const xmlContent = '<?xml version="1.0"?>\n' +
      builder.build({ labwc_config: rcConfig }).replace(/><\/action>/g, ' />');

    writeTextFile('.config/labwc/rc.xml', xmlContent, { dir: BaseDirectory.Home })
      .catch(error => console.error(error))
      .then(error => { alert(error || 'config saved.'); });
  };

  return (
    <div className="App">
      <main>

        <fieldset>
          <legend>NumLock on/off after boot</legend>
          <NumLock defaultOnOff={rcConfig?.keyboard?.numlock === 'on'} onChange={setNumLockOnOff} />
        </fieldset>

        <fieldset>
          <legend>Command & Keyboard binding</legend>
          <KeyBind keybind={
            rcConfig?.keyboard?.keybind &&
            (rcConfig.keyboard.keybind.length ? rcConfig.keyboard.keybind : [ rcConfig.keyboard.keybind ]) ||
            []
          } />
        </fieldset>

        <AutoStart items={rcConfig?.autostart || []} onUpdate={updateAutoStartItems} />

      </main>
      <footer>
        <button onClick={reload}>Reload</button>
        <button onClick={save}>Save</button>
      </footer>
    </div>
  );
}

export default App;
