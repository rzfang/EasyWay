import { BaseDirectory, exists, readTextFile, writeTextFile } from '@tauri-apps/plugin-fs';
import { Command } from '@tauri-apps/plugin-shell'
import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import { XMLParser, XMLBuilder } from 'fast-xml-parser';

async function init () {
  const existing = await exists('labwc/rc.xml', { baseDir: BaseDirectory.Config });
  const defaultConfig = {
    desktops: {
      '@_number': 1,
      popupTime: 1000,
    },
    keyboard: {
      keybind: [],
      numlock: 'off',
    },
  };

  if (!existing) {
    console.log('rc.xml not existant!');

    return defaultConfig;
  }

  const text = await readTextFile('labwc/rc.xml', { baseDir: BaseDirectory.Config });

  if (!text) {
    console.log('empty rc.xml!');

    return defaultConfig;
  }

  const parser = new XMLParser({ ignoreAttributes : false });

  const rootConfig = parser.parse(text);

  const rcConfig = rootConfig?.openbox_config || rootConfig?.labwc_config;

  if (!rcConfig) {
    console.log('weird rc.xml?');

    return defaultConfig;
  }

  if (!rcConfig.desktops) {
    rcConfig.desktops = defaultConfig.desktops;
  }

  if (!rcConfig.desktops['@_number']) {
    rcConfig.desktops['@_number'] = 1;
  } else {
    rcConfig.desktops['@_number'] = parseInt(rcConfig.desktops['@_number'], 10);
  }

  if (!rcConfig.keyboard) {
    rcConfig.keyboard = defaultConfig.keyboard;
  }

  if (!rcConfig.keyboard.keybind) {
    rcConfig.keyboard.keybind = defaultConfig.keyboard.keybind;
  } else if (!Array.isArray(rcConfig.keyboard.keybind)) {
    rcConfig.keyboard.keybind = [ rcConfig.keyboard.keybind ];
  }

  if (!rcConfig.keyboard.numlock) {
    rcConfig.keyboard.numlock = defaultConfig.keyboard.numlock;
  }

  return rcConfig;
}

const config = await init();

interface Store_I {
  addBind: () => void;
  config: {
    desktops: {
      '@_number': number;
      popupTime: number;
    };
    keyboard: {
      keybind: {
        '@_key': string;
        action: {
          '@_command'?: string;
          '@_name': 'Execute' | 'GoToDesktop';
          '@_to'?: 'left' | 'right';
        };
      }[];
      numlock: 'on' | 'off';
    };
  };
  deleteBind: (index: number) => void;
  save: () => void;
  toggleNumLock: () => void;
  updateBindCommand: (index: number, command: string) => void;
  updateBindKey: (index: number, bind: string) => void;
  updateBindType: (index: number, type: string) => void;
  updateWorkspaceNumber: (number: number) => void;
}

const useStore = create<Store_I>()(immer((set, get) => {
  return {
    config,
    toggleNumLock: () => set(state => {
      state.config.keyboard.numlock = state.config.keyboard.numlock === 'on' ? 'off' : 'on';
    }),
    addBind: () => set(state => {
      state.config.keyboard.keybind.push({
        '@_key': 'W-a',
        action: {
          '@_name': 'Execute',
          '@_command': '',
        },
      });
    }),
    deleteBind: index => set(state => {
      state.config.keyboard.keybind.splice(index, 1);
    }),
    updateBindKey: (index, bind) => set(state => {
      state.config.keyboard.keybind[index]['@_key'] = bind;
    }),
    updateBindCommand: (index, command) => set(state => {
      state.config.keyboard.keybind[index].action['@_command'] = command;
    }),
    updateBindType: (index, type) => set(state => {
      state.config.keyboard.keybind[index].action = type === 'Execute' ?
        { '@_command': '', '@_name': 'Execute' } :
        { '@_name': 'GoToDesktop', '@_to': 'left' };
    }),
    updateWorkspaceNumber: (number) => set(state => {
      state.config.desktops['@_number'] = number;
    }),
    save: () => {
      const builder = new XMLBuilder({ format: true, ignoreAttributes: false });
      const { config } = get();

      const xmlContent = '<?xml version="1.0"?>\n' +
        builder.build({ labwc_config: config }).replace(/><\/action>/g, ' />');

      writeTextFile('labwc/rc.xml', xmlContent, { baseDir: BaseDirectory.Config })
        .then(() => {
          const cmd = Command.create('labwc-config-reload', [ '-r' ]);

          cmd.on('close', () => alert('Config updated.'));
          cmd.on('error', error => console.error(error));
          cmd.stdout.on('data', line => console.log(`command stdout: "${line}"`));
          cmd.stderr.on('data', line => console.log(`command stderr: "${line}"`));
          cmd.spawn();
        })
        .catch(error => {
          console.error(error);
          alert('Oops, something wrong!');
        });
    }
  };
}));

export default useStore;
