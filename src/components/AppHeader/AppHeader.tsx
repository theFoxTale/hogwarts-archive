import { Component } from 'react';
import { APP_STRINGS } from '../../constants';

import './AppHeader.css';
import errorIcon from '../../assets/error.png';

interface AppHeaderProps {
  onSimulateError: () => void;
}

export class AppHeader extends Component<AppHeaderProps> {
  render() {
    return (
      <div className="app-header">
        <p className="app-name">{APP_STRINGS.APP_NAME}</p>
        <button
          onClick={this.props.onSimulateError}
          className="error-test-button"
        >
          <img
            src={errorIcon}
            alt={APP_STRINGS.ERROR_BUTTON_TOOLTIP}
            className="error-icon-img"
          />
        </button>
      </div>
    );
  }
}
