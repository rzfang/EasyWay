import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';

interface Preference_I {
  theme: string;
}

function init (): Preference_I {
  return {
    theme: window.localStorage.getItem('theme') || 'dark',
  };
}

const preference = init();

interface Store_I extends Preference_I {
  changTheme: (_newTheme: string) => void;
}

const useStore = create<Store_I>()(immer((set) => {
  return {
    ...preference,
    changTheme: (newTheme) => set(state => {
      state.theme = newTheme;
      window.localStorage.setItem('theme', newTheme);
    }),
  };
}));

export default useStore;
