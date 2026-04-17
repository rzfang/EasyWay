import './App.css';
import './components.css';

import { getCurrentWindow, LogicalSize } from '@tauri-apps/api/window';
import { ReactNode, useEffect } from 'react';

import AutoStart from './AutoStart';
import KeyBind from './KeyBind';
// import Launcher from './Launcher';
import NumLock from './NumLock';
import Preference from './Preference';
import TabBox from './TabBox';
import usePreference from './stores/preference.store.ts';
import Workspace from './Workspace';

function App (): ReactNode {
  // To Do: this is a work around. refer to https://github.com/tauri-apps/tauri/issues/9289.

  const theme = usePreference(state => state.theme);

  useEffect(() => {
    setTimeout(() => getCurrentWindow().setSize(new LogicalSize(801, 600)), 10);
  }, []);

  return (
    <div className={`App ${theme}`}>
      <TabBox
        tabs={[
          { content: (<NumLock />), label: 'NumLock on/off' },
          { content: (<KeyBind />), label: 'Hotkeys' },
          { content: (<AutoStart />), label: 'Autostart' },
          // { content: (<Launcher />), label: 'Launchers' },
          { content: (<Workspace />), label: 'Workspaces' },
          { content: (<Preference />), label: 'Preference' },
          // { content: (<div></div>), label: 'About' },
        ]}
      />
    </div>
  );
}

export default App;
