import { useTranslations } from 'next-intl';
import { useNavigate } from 'react-router-dom';

import { FrameButton } from '@ui';

import './NotFoundPage.css';
const ornamentIcon = '/images/ornament/character-ends-ornament.png';

export function NotFoundPage() {
  const lang = useTranslations('notFound');

  const navigate = useNavigate();
  const navigateToHomePage = () => {
    navigate('/');
  };

  return (
    <div className="not-found">
      <p className="magic-subtitle">{lang('upperHeader')}</p>
      <h1 className="not-found__title magic-title">{lang('mainTitle')}</h1>
      <div className="not-found__subtitle">
        <img
          src={ornamentIcon}
          alt={lang('ornamentAlt')}
          className="not-found__ornament"
        />
        <h2 className="magic-subtitle">{lang('subTitle')}</h2>
        <img
          src={ornamentIcon}
          alt={lang('ornamentAlt')}
          className="not-found__ornament not-found__ornament--mirrored"
        />
      </div>
      <p className="magic-subtitle">{lang('description1')}</p>
      <p className="magic-subtitle">{lang('description2')}</p>
      <FrameButton className="not-found__button" onClick={navigateToHomePage}>
        {lang('button')}
      </FrameButton>
    </div>
  );
}
