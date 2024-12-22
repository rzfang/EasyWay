import { BaseDirectory, exists, readTextFile, writeTextFile } from '@tauri-apps/plugin-fs';
import { Command } from '@tauri-apps/plugin-shell'
import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import { XMLParser, XMLBuilder, XMLValidator } from 'fast-xml-parser';

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

  return rcConfig;
}

const config = await init();

// const useStore = create(set => {
//   return {
//     config,
//     toggleNumLock: () => {
//       set(state => {
//         return {
//           config: {
//             keyboard: {
//               numlock: state.config.keyboard.numlock === 'on' ? 'off' : 'on'
//             },
//           },
//         };
//       });
//     },
//   };
// });

const useStore = create()(immer(set => {
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
    save: config => {
      const builder = new XMLBuilder({ format: true, ignoreAttributes: false });

      const xmlContent = '<?xml version="1.0"?>\n' +
        builder.build({ labwc_config: config }).replace(/><\/action>/g, ' />');

      writeTextFile('.config/labwc/rc.xml', xmlContent, { baseDir: BaseDirectory.Home })
        .then(() => {
          const cmd = Command.create('labwc-config-reload', [ '-r' ]);

          cmd.on('close', data => alert('Config updated.'));
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
