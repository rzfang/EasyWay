import { BaseDirectory, exists, readTextFile, writeTextFile } from '@tauri-apps/plugin-fs';
import { Command } from '@tauri-apps/plugin-shell'
import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import { XMLParser, XMLBuilder } from 'fast-xml-parser';

async function init () {
  const existing = await exists('.config/labwc/rc.xml', { baseDir: BaseDirectory.Home });
  const defaultConfig = {
    keyboard: {
      keybind: [],
      numlock: 'off',
    },
  };

  if (!existing) {
    console.log('rc.xml not existant!');

    return defaultConfig;
  }

  const text = await readTextFile('.config/labwc/rc.xml', { baseDir: BaseDirectory.Home });

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
    keyboard: {
      keybind: {
        '@_key': string;
        action: {
          '@_command': string;
          '@_name': string;
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
    save: () => {
      const builder = new XMLBuilder({ format: true, ignoreAttributes: false });
      const { config } = get();

      const xmlContent = '<?xml version="1.0"?>\n' +
        builder.build({ labwc_config: config }).replace(/><\/action>/g, ' />');

      writeTextFile('.config/labwc/rc.xml', xmlContent, { baseDir: BaseDirectory.Home })
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
