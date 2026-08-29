'use client';

import { useLocale, useTranslations } from 'next-intl';

import { Flag } from '@ui';
import { usePathname, useRouter } from '@/i18n/navigation';

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
    const nextLocale = locale === 'en' ? 'ru' : 'en';
    router.replace(pathname, { locale: nextLocale });
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
