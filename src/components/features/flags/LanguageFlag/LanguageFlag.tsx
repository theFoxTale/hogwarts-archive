'use client';

import { useLocale, useTranslations } from 'next-intl';
import { useRouter, usePathname } from 'next/navigation';

import { Flag } from '@ui';

import './LanguageFlag.css';

const flagTopLight = '/images/rounded-flag/flag-top.png';
const flagMiddleLight = '/images/rounded-flag/flag-middle.png';
const flagBottomLight = '/images/rounded-flag/flag-bottom.png';

const flagTopDark = flagTopLight;
const flagMiddleDark = flagMiddleLight;
const flagBottomDark = flagBottomLight;

const languageIcon = '/images/rounded-flag/error-icon.png';

export function LanguageFlag() {
  const lang = useTranslations('app');

  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  const toggleLanguage = () => {
    const newLocale = locale === 'en' ? 'ru' : 'en';

    const segments = pathname.split('/');
    if (segments.length > 1 && ['en', 'ru'].includes(segments[1])) {
      segments[1] = newLocale;
    } else {
      segments.splice(1, 0, newLocale);
    }

    const newPath = segments.join('/') || '/';
    router.push(newPath);
  };

  return (
    <Flag
      onClick={toggleLanguage}
      topImage={{ light: flagTopLight, dark: flagTopDark }}
      middleBackground={{ light: flagMiddleLight, dark: flagMiddleDark }}
      bottomImage={{ light: flagBottomLight, dark: flagBottomDark }}
      icon={{ light: languageIcon, dark: languageIcon }}
      text={lang('lang')}
      alt={lang('langAlt')}
      className="language-flag"
    />
  );
}
