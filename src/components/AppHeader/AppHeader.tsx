import { AboutFlag, ThemeFlag } from '../../components';
import { APP_STRINGS } from '../../constants';

import './AppHeader.css';
import emblemIcon from '../../assets/images/hogwarts-emblem.png';
import ornamentIcon from '../../assets/images/hogwarts-ornaments.png';

export function AppHeader() {
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
        <p className="app-header__description-text magic-subtitle">
          {APP_STRINGS.APP_DESCRIPTION}
        </p>
        <img
          src={ornamentIcon}
          alt={APP_STRINGS.APP_EMBLEM_TOOLTIP}
          className="app-header__ornament app-header__ornament--mirrored"
        />
      </div>
      <ThemeFlag />
    </div>
  );
}
