import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import { BaseDirectory, readDir } from '@tauri-apps/plugin-fs';

async function init (): Promise<string[]> {
  let entries = await readDir('/usr/share/applications');

  let apps = entries.reduce(
    (all, one) => {
      if (one.isFile && one.name.substr(one.name.lastIndexOf('.')) === '.desktop') {
        all.push(one.name);
      }

      return all;
    },
    [] as string[]
  );

  entries = await readDir('.local/share/applications', { baseDir: BaseDirectory.Home });

  apps = entries.reduce(
    (all, one) => {
      if (one.isFile && one.name.substr(one.name.lastIndexOf('.')) === '.desktop' && !all.includes(one.name)) {
        all.push(one.name);
      }

      return all;
    },
    apps
  );

  return apps;
}

const apps = await init();

interface Store_I {
  apps: string[];
}

// const useStore = create()(immer((set, get) => {
const useStore = create<Store_I>()(immer(() => {
  return { apps };
}));

export default useStore;
