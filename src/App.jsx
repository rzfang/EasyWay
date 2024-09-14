import "./App.css";

import { readTextFile, BaseDirectory } from '@tauri-apps/api/fs';
import { stringify , parse } from 'ini';
import { useEffect, useState } from "react";

function App () {
  const [ wayfireConfig, setWayfireConfig ] = useState({});
  const [ wfPanelPiConfig, setWfPanelPiConfig ] = useState({});

  useEffect(() => {
    readTextFile('.config/wayfire.ini', { dir: BaseDirectory.Home })
      .catch(error => console.log(error))
      .then((text) => {
        if (!text) {
          return alert('weird wayfire.ini ?');
        }

        setWayfireConfig(parse(text));
      });

    readTextFile('.config/wf-panel-pi.ini', { dir: BaseDirectory.Home })
      .catch(error => console.log(error))
      .then((text) => {
        if (!text) {
          return alert('weird wf-panel-pi.ini ?');
        }

        setWfPanelPiConfig(parse(text));
      });
  }, []);

  return (
    <div className="App">
      <textarea value={JSON.stringify(wayfireConfig)} />
      <textarea value={JSON.stringify(wfPanelPiConfig)} />
    </div>
  );
}

export default App;
