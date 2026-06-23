'use client';

import { useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

import { FrameButton } from '@ui';

import './not-found.css';
const ornamentIcon = '/images/ornament/character-ends-ornament.png';

export default function NotFound() {
  const lang = useTranslations('notFound');

  const router = useRouter();
  const navigateToHomePage = () => {
    router.push('/');
  };

  return (
    <div className="not-found">
      <p className="magic-subtitle">{lang('upperHeader')}</p>
      <h1 className="not-found__title magic-title">{lang('mainTitle')}</h1>
      <div className="not-found__subtitle">
        <Image
          src={ornamentIcon}
          alt={lang('ornamentAlt')}
          className="not-found__ornament"
          width={130}
          height={28}
        />
        <h2 className="magic-subtitle">{lang('subTitle')}</h2>
        <Image
          src={ornamentIcon}
          alt={lang('ornamentAlt')}
          className="not-found__ornament not-found__ornament--mirrored"
          width={130}
          height={28}
        />
      </div>
      <p className="magic-subtitle">{lang('description1')}</p>
      <p className="magic-subtitle">{lang('description2')}</p>\
      <FrameButton className="not-found__button" onClick={navigateToHomePage}>
        {lang('button')}
      </FrameButton>
    </div>
  );
}
