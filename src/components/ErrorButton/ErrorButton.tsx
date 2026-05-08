import { Component } from 'react';
import { APP_STRINGS } from '../../constants';

import './ErrorButton.css';
import errorIcon from '../../assets/error.png';

interface ErrorButtonProps {
  onSimulateError: () => void;
}

export class ErrorButton extends Component<ErrorButtonProps> {
  render() {
    return (
      <button
        onClick={this.props.onSimulateError}
        className="error-test-button"
        aria-label={APP_STRINGS.ERROR_BUTTON_TOOLTIP}
      >
        <img
          src={errorIcon}
          alt={APP_STRINGS.ERROR_BUTTON_TOOLTIP}
          className="error-icon-img"
        />
      </button>
    );
  }
}
