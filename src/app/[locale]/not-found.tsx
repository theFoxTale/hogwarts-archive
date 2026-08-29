import Image from 'next/image';
import { getTranslations } from 'next-intl/server';

import { FrameButton } from '@ui';
import { Link } from '@/i18n/navigation';

import './not-found.css';

const ornamentIcon = '/images/ornament/character-ends-ornament.png';

export default async function NotFound() {
  const lang = await getTranslations('notFound');

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
      <p className="magic-subtitle">{lang('description2')}</p>
      <Link href="/">
        <FrameButton className="not-found__button">
          {lang('button')}
        </FrameButton>
      </Link>
    </div>
  );
}
