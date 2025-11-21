import './App.css';
import './components.css';

import { getCurrentWindow, LogicalSize } from '@tauri-apps/api/window';
import { ReactNode } from 'react';

import AutoStart from './AutoStart';
import KeyBind from './KeyBind';
// import Launcher from './Launcher';
import NumLock from './NumLock';
import TabBox from './TabBox';
import Workspace from './Workspace';

function App (): ReactNode {
  // To Do: this is a work around. refer to https://github.com/tauri-apps/tauri/issues/9289.
  setTimeout(() => getCurrentWindow().setSize(new LogicalSize(801, 600)), 10);

  return (
    <div className="App">
      <TabBox
        tabs={[
          { content: (<NumLock />), label: 'NumLock on/off' },
          { content: (<KeyBind />), label: 'Hotkeys' },
          { content: (<AutoStart />), label: 'Autostart' },
          // { content: (<Launcher />), label: 'Launchers' },
          { content: (<Workspace />), label: 'Workspaces' },
          // { content: (<div></div>), label: 'About' },
        ]}
      />
    </div>
  );
}

export default App;
