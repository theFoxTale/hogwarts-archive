import { useTheme } from '../../contexts';

import './ThemeFlag.css';
import sunIcon from '../../assets/images/theme/light.png';
import moonIcon from '../../assets/images/theme/dark.png';

export function ThemeFlag() {
  const { theme, toggleTheme } = useTheme();
  console.log('theme', theme);

  return (
    <div className="theme-flag" onClick={toggleTheme}>
      <img
        src={theme === 'light' ? sunIcon : moonIcon}
        alt="Theme"
        className="theme-flag__icon"
      />
    </div>
  );
}
