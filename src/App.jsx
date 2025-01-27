import "./App.css";

import { BaseDirectory, exists, readTextFile, writeTextFile } from '@tauri-apps/plugin-fs';
import { useEffect, useState } from "react";
import { XMLParser, XMLBuilder, XMLValidator } from 'fast-xml-parser';

import AutoStart from './AutoStart';
import KeyBind from './KeyBind';
import Launcher from './Launcher';
import NumLock from './NumLock';

function App () {
  const [ tab, setTab ] = useState('');

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
          <button disabled={tab === 'launcher'} value="launcher" onClick={switchTab}>Launchers</button>
        </nav>
      </header>
      <main>
        {
          tab === 'numlock' && (<NumLock />) ||
          tab === 'hotkeys' && (<KeyBind />) ||
          tab === 'autostart' && (<AutoStart />) ||
          tab === 'launcher' && (<Launcher />)
        }
      </main>
    </div>
  );
}

export default App;
