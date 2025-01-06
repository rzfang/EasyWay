import "./App.css";

import { BaseDirectory, exists, readTextFile, writeTextFile } from '@tauri-apps/plugin-fs';
import { useEffect, useState } from "react";
import { XMLParser, XMLBuilder, XMLValidator } from 'fast-xml-parser';

import AutoStart from './AutoStart';
import KeyBind from './KeyBind';
import NumLock from './NumLock';
import useRcStore from './stores/rc.store.ts';

function App () {
  const [ tab, setTab ] = useState('');
  const rcConfig = useRcStore(state => state.config);
  const saveRc = useRcStore(state => state.save);

  const switchTab = (event) => {
    setTab(event.currentTarget.value);
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
    </div>
  );
}

export default App;
