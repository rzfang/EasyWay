import "./App.css";

import { readTextFile, BaseDirectory } from '@tauri-apps/api/fs';
import { stringify , parse } from 'ini';
import { useEffect, useState } from "react";

import AutoStart from './AutoStart';
import KeyBind from './KeyBind';
import NumLock from './NumLock';

function App () {
  const [ wayfireConfig, setWayfireConfig ] = useState({});

  useEffect(() => {
    readTextFile('.config/wayfire.ini', { dir: BaseDirectory.Home })
      .catch(error => console.log(error))
      .then((text) => {
        if (!text) {
          return alert('weird wayfire.ini ?');
        }

        setWayfireConfig(parse(text));
      });
  }, []);

  console.log('--- 001');
  console.log(wayfireConfig);

  const setNumLockOnOff = (event, onOff) => {
    if (!wayfireConfig.input) {
      wayfireConfig.input = {};
    }

    wayfireConfig.input.kb_numlock_default_state = onOff;
  };

  const updateAutoStartItems = (event, items) => {
    if (!wayfireConfig.autostart) {
      wayfireConfig.autostart = {};
    }

    wayfireConfig.autostart = items;

    setWayfireConfig({ ...wayfireConfig });
  };

  return (
    <div className="App">
      <main>

        <fieldset>
          <legend>NumLock on/off after boot</legend>
          <NumLock defaultOnOff={wayfireConfig?.input?.kb_numlock_default_state} onChange={setNumLockOnOff} />
        </fieldset>

        <AutoStart items={wayfireConfig?.autostart || []} onUpdate={updateAutoStartItems} />

        <KeyBind items={wayfireConfig?.command || {}} />

      </main>
      <footer>
        <button>Cancel</button>
        <button>Save</button>
      </footer>
    </div>
  );
}

export default App;
