import { BaseDirectory, exists, readTextFile, writeTextFile } from '@tauri-apps/plugin-fs';
import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import { parse, stringify } from 'ini'

async function init () {
  const existing = await exists('.config/wf-panel-pi.ini', { baseDir: BaseDirectory.Home });

  if (!existing) {
    console.log('wf-panel-pi.ini not existant!');

    return [];
  }

  const text = await readTextFile('.config/wf-panel-pi.ini', { baseDir: BaseDirectory.Home });

  if (!text) {
    console.log('empty wf-panel-pi.ini!');

    return [];
  }

  const { panel } = parse(text);

  if (!panel) {
    console.log('weird panel block in wf-panel-pi.ini!');

    return [];
  }

  return panel;
}

const config = await init();

interface Launcher_I {
  app: string;
  id: number;
}

interface Store_I {
  addLauncher: () => void;
  changeLaucherOrder: (index: number, order: number) => void;
  launchers: Launcher_I[];
  removeLauncher: (index: number) => void;
  saveLaunchers: () => void;
  updateLauncher: (index: number, value: string) => void;
  config: {
    [key: string]: string;
  };
}

const useStore = create<Store_I>()(immer((set, get) => {
  const timeStamp = Date.now();

  const launchers = Object
    .entries(config)
    .filter(([ key ]) => key.indexOf('launcher_') === 0)
    .sort(([ keyA ], [ keyB ]) => keyB > keyA ? -1 : 0)
    .map(([ , value ], index) => {
      return {
        app: value,
        id: timeStamp + index,
      } as Launcher_I;
    });

  return {
    config,
    launchers,
    addLauncher: () => set(state => {
      state.launchers.push({ app: '', id: Date.now() } as Launcher_I);
    }),
    changeLaucherOrder: (index, order) => set(state => {
      if ((order === -1 && index === 0) || ((order === 1) && (index >= (state.launchers.length - 1)))) {
        return;
      }

      const t = state.launchers[index];

      state.launchers[index] = state.launchers[index + order];
      state.launchers[index + order] = t;
    }),
    removeLauncher: index => set(state => {
      state.launchers.splice(index, 1);
    }),
    saveLaunchers: () => {
      const { config, launchers } = get();

      const newConfig = Object
        .entries(config)
        .filter(([ key ]) => key.indexOf('launcher_') === -1)
        .reduce(
          (whole, [ key, value ]) => {
            whole[key] = value;

            return whole;
          },
          {} as { [key: string]: string; }
        );

      launchers.forEach(({ app }, index) => {
        newConfig['launcher_' + (index + 1).toString().padStart(6, '0')] = app;
      });

      const text = stringify({ panel: newConfig });

      writeTextFile('.config/wf-panel-pi.ini', text, { baseDir: BaseDirectory.Home })
        .catch(error => {
          console.error(error);
          alert('Oops, something wrong!');
        });
    },
    updateLauncher: (index, value) => set(state => {
      state.launchers[index].app = value;
    }),
  };
}));

export default useStore;
