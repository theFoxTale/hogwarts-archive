import { AboutFlag, ErrorFlag, ThemeFlag } from '@features';
import { APP_STRINGS } from '@constants';

import './AppHeader.css';
import emblemIcon from '../../../assets/images/hogwarts-emblem.png';
import ornamentIcon from '../../../assets/images/hogwarts-ornaments.png';

interface AppHeaderProps {
  onSimulateError?: () => void;
}

export function AppHeader({ onSimulateError }: AppHeaderProps) {
  return (
    <div className="app-header">
      <AboutFlag />
      <img
        src={emblemIcon}
        alt={APP_STRINGS.APP_EMBLEM_TOOLTIP}
        className="app-header__emblem"
      />
      <p className="app-header__title magic-title">{APP_STRINGS.APP_NAME}</p>
      <div className="app-header__description">
        <img
          src={ornamentIcon}
          alt={APP_STRINGS.APP_EMBLEM_TOOLTIP}
          className="app-header__ornament"
        />
        <p className="magic-subtitle">{APP_STRINGS.APP_DESCRIPTION}</p>
        <img
          src={ornamentIcon}
          alt={APP_STRINGS.APP_EMBLEM_TOOLTIP}
          className="app-header__ornament app-header__ornament--mirrored"
        />
      </div>
      {onSimulateError && <ErrorFlag onSimulateError={onSimulateError} />}
      <ThemeFlag />
    </div>
  );
}
