import { useTranslations } from 'next-intl';

import { Flag } from '@ui';
import { useRouter } from '@/i18n/navigation';

import './AboutFlag.css';

// изображения для светлой темы
const flagTopLight = '/images/flag/light/flag-top.png';
const flagMiddleLight = '/images/flag/light/flag-middle.png';
const flagBottomLight = '/images/flag/light/flag-bottom.png';

// изображения для тёмной темы
const flagTopDark = '/images/flag/dark/flag-top.png';
const flagMiddleDark = '/images/flag/dark/flag-middle.png';
const flagBottomDark = '/images/flag/dark/flag-bottom.png';

const aboutIcon = '/images/flag/about-icon.png';

export function AboutFlag() {
  const lang = useTranslations('app');
  const router = useRouter();

  return (
    <Flag
      onClick={() => router.push('/about')}
      topImage={{
        light: flagTopLight,
        dark: flagTopDark,
        width: 481,
        height: 289,
      }}
      middleBackground={{ light: flagMiddleLight, dark: flagMiddleDark }}
      bottomImage={{
        light: flagBottomLight,
        dark: flagBottomDark,
        width: 481,
        height: 275,
      }}
      icon={{ light: aboutIcon, dark: aboutIcon, width: 1063, height: 1027 }}
      text={lang('about')}
      alt={lang('aboutAlt')}
      className="about-flag"
    />
  );
}
