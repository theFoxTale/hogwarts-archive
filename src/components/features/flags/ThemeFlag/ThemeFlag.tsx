import { useTranslations } from 'next-intl';

import { Flag } from '@ui';
import { useTheme } from '@contexts';

import './ThemeFlag.css';

// изображения для светлой темы
import flagTopLight from '../../../../assets/images/triangle-flag/light/flag-top.png';
import flagMiddleLight from '../../../../assets/images/triangle-flag/light/flag-middle.png';
import flagBottomLight from '../../../../assets/images/triangle-flag/light/flag-bottom.png';

// изображения для тёмной темы
import flagTopDark from '../../../../assets/images/triangle-flag/dark/flag-top.png';
import flagMiddleDark from '../../../../assets/images/triangle-flag/dark/flag-middle.png';
import flagBottomDark from '../../../../assets/images/triangle-flag/dark/flag-bottom.png';

import sunIcon from '../../../../assets/images/triangle-flag/sun-icon.png';
import moonIcon from '../../../../assets/images/triangle-flag/moon-icon.png';

export function ThemeFlag() {
  const lang = useTranslations('app');
  const { theme, toggleTheme } = useTheme();

  return (
    <Flag
      onClick={toggleTheme}
      topImage={{ light: flagTopLight, dark: flagTopDark }}
      middleBackground={{ light: flagMiddleLight, dark: flagMiddleDark }}
      bottomImage={{ light: flagBottomLight, dark: flagBottomDark }}
      icon={{
        light: sunIcon,
        dark: moonIcon,
      }}
      text={lang('theme')}
      alt={theme === 'light' ? lang('themeAltLight') : lang('themeAltDark')}
      className="theme-flag"
    />
  );
}
