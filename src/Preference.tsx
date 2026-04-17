import { ReactNode, SyntheticEvent } from 'react';

import usePreferenceStore from './stores/preference.store.ts';

function Preference (): ReactNode {
  const theme = usePreferenceStore(state => state.theme);
  const changeTheme = usePreferenceStore(state => state.changTheme);

  const themeSwitch = (event: SyntheticEvent<HTMLInputElement>) => {
    changeTheme(event.currentTarget.value);
  }

  return (
    <div className="Preference">
      <section className='theme'>
        <div>Theme</div>
        <div>{theme}</div>
        <div>
          <label>
            <span>light</span>
            <input name="theme" type="radio" value="light" defaultChecked={theme === 'light'} onChange={themeSwitch} />
          </label>
          <label>
            <span>dark</span>
            <input name="theme" type="radio" value="dark" defaultChecked={theme === 'dark'} onChange={themeSwitch} />
          </label>
        </div>
      </section>
    </div>
  );
}

export default Preference;
