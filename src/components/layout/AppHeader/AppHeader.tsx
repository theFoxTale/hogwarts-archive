'use client';
import { useTranslations } from 'next-intl';
import Image from 'next/image';

import { AboutFlag, LanguageFlag, ThemeFlag } from '@features';

import './AppHeader.css';
const emblemIcon = '/images/hogwarts-emblem.png';
const ornamentIcon = '/images/ornament/hogwarts-ornaments.png';

export function AppHeader() {
  const lang = useTranslations('app');
  return (
    <div className="app-header">
      <AboutFlag />
      <Image
        src={emblemIcon}
        alt={lang('emblemTooltip')}
        className="app-header__emblem"
        width={350}
        height={80}
        priority
        loading="eager"
      />
      <p className="app-header__title magic-title">{lang('title')}</p>
      <div className="app-header__description">
        <Image
          src={ornamentIcon}
          alt={lang('ornamentTooltip')}
          className="app-header__ornament"
          width={55}
          height={15}
        />
        <p className="magic-subtitle">{lang('description')}</p>
        <Image
          src={ornamentIcon}
          alt={lang('ornamentTooltip')}
          className="app-header__ornament app-header__ornament--mirrored"
          width={55}
          height={15}
        />
      </div>
      <LanguageFlag />
      <ThemeFlag />
    </div>
  );
}
