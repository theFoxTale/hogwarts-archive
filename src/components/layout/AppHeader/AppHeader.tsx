'use client';
import { useTranslations } from 'next-intl';

import { AboutFlag, LanguageFlag, ThemeFlag } from '@features';

import './AppHeader.css';
import emblemIcon from '../../../assets/images/hogwarts-emblem.png';
import ornamentIcon from '../../../assets/images/ornament/hogwarts-ornaments.png';

export function AppHeader() {
  const lang = useTranslations('app');
  return (
    <div className="app-header">
      <AboutFlag />
      <img
        src={emblemIcon}
        alt={lang('emblemTooltip')}
        className="app-header__emblem"
      />
      <p className="app-header__title magic-title">{lang('title')}</p>
      <div className="app-header__description">
        <img
          src={ornamentIcon}
          alt={lang('ornamentTooltip')}
          className="app-header__ornament"
        />
        <p className="magic-subtitle">{lang('description')}</p>
        <img
          src={ornamentIcon}
          alt={lang('ornamentTooltip')}
          className="app-header__ornament app-header__ornament--mirrored"
        />
      </div>
      <LanguageFlag />
      <ThemeFlag />
    </div>
  );
}
