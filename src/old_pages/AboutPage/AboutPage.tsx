import { useTranslations } from 'next-intl';
import { useNavigate } from 'react-router-dom';

import { FrameButton, OrnateFrame } from '@ui';

import './AboutPage.css';

export function AboutPage() {
  const lang = useTranslations('about');

  const navigate = useNavigate();
  const navigateToHomePage = () => {
    navigate('/');
  };

  return (
    <div className="about-container">
      <h1 className="about-title magic-title">{lang('header')}</h1>

      <div className="about-frames-container">
        <OrnateFrame className="variant-container">
          <p>{lang('description')}</p>
          <p>
            {lang('courseTitle')}:{' '}
            <a
              href="https://rs.school/react/"
              target="_blank"
              rel="noopener noreferrer"
            >
              {lang('course')}
            </a>
          </p>
        </OrnateFrame>
        <OrnateFrame className="variant-container">
          <p>
            {lang('authorTitle')}:{' '}
            <a
              href="https://github.com/theFoxTale"
              target="_blank"
              rel="noopener noreferrer"
            >
              {lang('author')}
            </a>
          </p>
        </OrnateFrame>
      </div>
      <FrameButton className="not-found__button" onClick={navigateToHomePage}>
        {lang('button')}
      </FrameButton>
    </div>
  );
}
