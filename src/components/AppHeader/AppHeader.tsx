import { Component } from 'react';
import { APP_STRINGS } from '../../constants';

import './AppHeader.css';
import emblemIcon from '../../assets/images/hogwarts-emblem.png';
import ornamentIcon from '../../assets/images/hogwarts-ornaments.png';

export class AppHeader extends Component {
  render() {
    return (
      <div className="app-header">
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
      </div>
    );
  }
}
