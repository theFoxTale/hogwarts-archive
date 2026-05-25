import { useState } from 'react';

import './ThemeFlag.css';
import sunIcon from '../../assets/images/theme/light.png';
import moonIcon from '../../assets/images/theme/dark.png';

export function ThemeFlag() {
  const [theme, setTheme] = useState('dark');

  const handleSearch = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  return (
    <div className="theme-flag" onClick={handleSearch}>
      <img
        src={theme === 'light' ? sunIcon : moonIcon}
        alt="Theme"
        className="theme-flag__icon"
      />
    </div>
  );
}
