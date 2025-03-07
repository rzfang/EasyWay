import * as path from '@tauri-apps/api/path';
import { BaseDirectory, readDir, readTextFile } from '@tauri-apps/plugin-fs';
import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';

interface App_I {
  command: string;
  file: string;
  path: string;
}

async function init (): Promise<App_I[]> {
  let directoryPath = '/usr/share/applications';

  let entries = await readDir(directoryPath);

  // for (const file of entries) {
  //   console.log(`Found file: ${file.name}`);
  //   if (file.name.endsWith('.desktop')) {
  //     console.log('--- 002');
  //     const content = await readTextFile(file.path);
  //     console.log('--- 001');
  //     console.log(`Content of ${file.name}:\n`, content);
  //   }
  // }

  let apps = entries.reduce(
    (all, one) => {
      if (one.isFile && one.name.substr(one.name.lastIndexOf('.')) === '.desktop') {
        all.push({
          command: '',
          file: one.name,
          path: directoryPath,
        });
      }

      return all;
    },
    [] as App_I[]
  );

  directoryPath = 'applications';

  entries = await readDir(directoryPath, { baseDir: BaseDirectory.LocalData });

  apps = entries.reduce(
    (all, one) => {
      if (
        one.isFile &&
        one.name.substr(one.name.lastIndexOf('.')) === '.desktop' &&
        // !all.includes(one.name) &&
        all.some(oneOfAll => one.name === oneOfAll.file)
      ) {
        all.push({
          command: '',
          file: one.name,
          path: directoryPath,
        });
      }

      return all;
    },
    apps
  );

  // console.log('--- 004');
  // console.log(await path.join('/usr/share/applications', apps[0].file))

  // const gj = await readTextFile(apps[0].file, { baseDir: '/usr/share/applications' });

  // console.log('--- 005');

  // console.log('--- 002', apps[0], `/usr/share/applications/${apps[0].file}`);
  // const gj = await readTextFile(`/usr/share/applications/${apps[0].file}`);
  // console.log(gj);

  // const results = await Promise.all(apps.map(async ({ file, path }) => {
  //   // console.log('--- 003', file, path);

  //   const gj = await readTextFile(file, { baseDir: '/usr/share/applications' })
  //     // .then(() => {
  //     //   console.log('--- 002');
  //     // });

  //   console.log('--- 002');
  //   console.log(gj);

  //   return gj;


  //   // return readTextFile(file, { baseDir: '/usr/share/applications' })
  //   //   .then((...text) => {
  //   //     console.log('--- 002');
  //   //     console.log(text);

  //   //     return text;

  //   //     // return text.split('\n').find(line => line.indexOf('EXec=') === 0);
  //   //   });
  // }));

  // console.log('--- 001');
  // console.log(results);

  return apps.sort((a, b) => (a.file < b.file ? -1 : 1));
}

const apps = await init();

interface Store_I {
  apps: App_I[];
}

// const useStore = create()(immer((set, get) => {
const useStore = create<Store_I>()(immer(() => {
  return { apps };
}));

export default useStore;
