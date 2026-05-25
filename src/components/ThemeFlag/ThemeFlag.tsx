import { useTheme } from '../../contexts';
import { THEME_STRINGS } from '../../constants';

import './ThemeFlag.css';
import sunIcon from '../../assets/images/theme/light.png';
import moonIcon from '../../assets/images/theme/dark.png';

export function ThemeFlag() {
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="theme-flag" onClick={toggleTheme}>
      <img
        src={theme === 'light' ? sunIcon : moonIcon}
        alt={
          theme === 'light' ? THEME_STRINGS.ALT_LIGHT : THEME_STRINGS.ALT_DARK
        }
        className="theme-flag__icon"
      />
    </div>
  );
}
