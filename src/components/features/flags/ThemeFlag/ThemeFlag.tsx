import { useTranslations } from 'next-intl';

import { Flag } from '@ui';
import { useTheme } from '@contexts';

import './ThemeFlag.css';

// изображения для светлой темы
const flagTopLight = '/images/triangle-flag/light/flag-top.png';
const flagMiddleLight = '/images/triangle-flag/light/flag-middle.png';
const flagBottomLight = '/images/triangle-flag/light/flag-bottom.png';

// изображения для тёмной темы
const flagTopDark = '/images/triangle-flag/dark/flag-top.png';
const flagMiddleDark = '/images/triangle-flag/dark/flag-middle.png';
const flagBottomDark = '/images/triangle-flag/dark/flag-bottom.png';

const sunIcon = '/images/triangle-flag/sun-icon.png';
const moonIcon = '/images/triangle-flag/moon-icon.png';

export function ThemeFlag() {
  const lang = useTranslations('app');
  const { toggleTheme } = useTheme();

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
      alt={lang('themeAlt')}
      className="theme-flag"
    />
  );
}
