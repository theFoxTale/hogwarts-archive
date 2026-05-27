import { useTheme } from '../../contexts';
import { THEME_STRINGS } from '../../constants';

import './ThemeFlag.css';

import flagTopLight from '../../assets/images/triangle-flag/light/flag-top.png';
import flagTopDark from '../../assets/images/triangle-flag/dark/flag-top.png';
import flagMiddleLight from '../../assets/images/triangle-flag/light/flag-middle.png';
import flagMiddleDark from '../../assets/images/triangle-flag/dark/flag-middle.png';
import flagBottomLight from '../../assets/images/triangle-flag/light/flag-bottom.png';
import flagBottomDark from '../../assets/images/triangle-flag/dark/flag-bottom.png';

import moonIcon from '../../assets/images/triangle-flag/moon-icon.png';
import sunIcon from '../../assets/images/triangle-flag/sun-icon.png';

export function ThemeFlag() {
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="flag theme-flag" onClick={toggleTheme}>
      <div className="flag-top">
        <img
          src={theme === 'light' ? flagTopLight : flagTopDark}
          alt={
            theme === 'light' ? THEME_STRINGS.ALT_LIGHT : THEME_STRINGS.ALT_DARK
          }
        />
      </div>
      <div
        className="flag-middle"
        style={{
          backgroundImage: `url(${theme === 'light' ? flagMiddleLight : flagMiddleDark})`,
        }}
      >
        <img
          src={theme === 'light' ? sunIcon : moonIcon}
          className="flag-icon"
          alt={
            theme === 'light' ? THEME_STRINGS.ALT_LIGHT : THEME_STRINGS.ALT_DARK
          }
        />
        <span className="flag-text magic-title">{THEME_STRINGS.TEXT}</span>
      </div>
      <div className="flag-bottom">
        <img
          src={theme === 'light' ? flagBottomLight : flagBottomDark}
          alt={
            theme === 'light' ? THEME_STRINGS.ALT_LIGHT : THEME_STRINGS.ALT_DARK
          }
        />
      </div>
    </div>
  );
}
