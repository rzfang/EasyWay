import { BaseDirectory, exists, readTextFile, writeTextFile } from '@tauri-apps/plugin-fs';
import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';

interface Command_I {
  command: string;
  id: number;
}

async function init (): Promise<Command_I[]> {
  const existing = await exists('.config/labwc/autostart', { baseDir: BaseDirectory.Home });
  const defaultConfig: Command_I[] = [];

  if (!existing) {
    console.log('autostart not existant!');

    return defaultConfig;
  }

  const text = await readTextFile('.config/labwc/autostart', { baseDir: BaseDirectory.Home });

  if (!text) {
    console.log('empty autostart!');

    return defaultConfig;
  }

  const now = Date.now();

  return text
    .split('&\n')
    .map((command, index) => {
      return { command, id: now + index };
    });
}

const items = await init();

interface Store_I {
  addOne: () => void;
  deleteOne: (index: number) => void;
  items: Command_I[];
  save: () => void;
  updateOne: (index: number, command: string) => void;
};

const useStore = create<Store_I>()(immer((set, get) => {
  return {
    items,
    addOne: () => set(state => {
      state.items.push({ command: 'echo "a_new_command."', id: Date.now() });
    }),
    deleteOne: index => set(state => {
      state.items.splice(index, 1);
    }),
    updateOne: (index, command) => set(state => {
      state.items[index].command = command;
    }),
    save: () => {
      const { items } = get();

      writeTextFile(
        '.config/labwc/autostart',
        items.map(({ command }) => command.trim()).join(' &\n'),
        { baseDir: BaseDirectory.Home }
      )
        .then(() => {
          alert('Commands saved.');
        })
        .catch(error => {
          console.error(error);
          alert('Oops, something wrong!');
        });
    },
  };
}));

export default useStore;
