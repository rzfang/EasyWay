import { BaseDirectory, exists, readTextFile, writeTextFile } from '@tauri-apps/plugin-fs';
import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';

async function init () {
  const existing = await exists('.config/labwc/autostart', { baseDir: BaseDirectory.Home });
  const defaultConfig = [];

  if (!existing) {
    console.log('autostart not existant!');

    return defaultConfig;
  }

  const text = await readTextFile('.config/labwc/autostart', { baseDir: BaseDirectory.Home });

  if (!text) {
    console.log('empty autostart!');

    return defaultConfig;
  }

  return text.split('&\n');
}

const items = await init();

const useStore = create()(immer(set => {
  return {
    items,
    addOne: () => set(state => {
      state.items.push('echo "a_new_command."');
    }),
    deleteOne: index => set(state => {
      state.items.splice(index, 1);
    }),
    updateOne: (index, command) => set(state => {
      state.items[index] = command;
    }),
  };
}));

export default useStore;
