import { useNavigate } from 'react-router-dom';
import { NOT_FOUND_STRINGS } from './constants';
import { FrameButton } from '@ui';

import './NotFoundPage.css';
import ornamentIcon from '../../assets/images/ornament/character-ends-ornament.png';

export function NotFoundPage() {
  const navigate = useNavigate();
  const navigateToHomePage = () => {
    navigate('/');
  };

  return (
    <div className="not-found">
      <p className="magic-subtitle">{NOT_FOUND_STRINGS.UPPER_HEADER}</p>
      <h1 className="not-found__title magic-title">
        {NOT_FOUND_STRINGS.MAIN_TITLE}
      </h1>
      <div className="not-found__subtitle">
        <img
          src={ornamentIcon}
          alt={NOT_FOUND_STRINGS.ORNAMENT_TOOLTIP}
          className="not-found__ornament"
        />
        <h2 className="magic-subtitle">{NOT_FOUND_STRINGS.SUB_TITLE}</h2>
        <img
          src={ornamentIcon}
          alt={NOT_FOUND_STRINGS.ORNAMENT_TOOLTIP}
          className="not-found__ornament not-found__ornament--mirrored"
        />
      </div>
      <p className="magic-subtitle">
        {NOT_FOUND_STRINGS.DESCRIPTION_FIRST_LINE}
      </p>
      <p className="magic-subtitle">
        {NOT_FOUND_STRINGS.DESCRIPTION_SECOND_LINE}
      </p>
      <FrameButton className="not-found__button" onClick={navigateToHomePage}>
        {NOT_FOUND_STRINGS.BUTTON_TEXT}
      </FrameButton>
    </div>
  );
}
