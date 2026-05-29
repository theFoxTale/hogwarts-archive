import { useNavigate } from 'react-router-dom';

import { ABOUT_PAGE_STRINGS } from './constants';
import { FrameButton, OrnateFrame } from '@ui';

import './AboutPage.css';

export function AboutPage() {
  const navigate = useNavigate();
  const navigateToHomePage = () => {
    navigate('/');
  };

  return (
    <div className="about-container">
      <h1 className="magic-title">{ABOUT_PAGE_STRINGS.ABOUT_HEADER}</h1>

      <div className="about-frames-container">
        <OrnateFrame className="variant-container">
          <p>This application is a test page for HarryPotter API.</p>
          <p>
            Course:{' '}
            <a
              href="https://rs.school/react/"
              target="_blank"
              rel="noopener noreferrer"
            >
              RS School React
            </a>
          </p>
        </OrnateFrame>
        <OrnateFrame className="variant-container">
          <p>
            Author:{' '}
            <a
              href="https://github.com/theFoxTale"
              target="_blank"
              rel="noopener noreferrer"
            >
              Annie theFoxTale
            </a>
          </p>
        </OrnateFrame>
      </div>
      <FrameButton className="not-found__button" onClick={navigateToHomePage}>
        {ABOUT_PAGE_STRINGS.BUTTON_TEXT}
      </FrameButton>
    </div>
  );
}
