import { Component } from 'react';

import './AppHeader.css';
import errorIcon from '../../assets/error.png';

interface AppHeaderProps {
  onSimulateError: () => void;
}

export class AppHeader extends Component<AppHeaderProps> {
  render() {
    return (
      <div className="app-header">
        <p className="app-name">Harry Potter's API Test Page</p>
        <button
          onClick={this.props.onSimulateError}
          className="error-test-button"
        >
          <img
            src={errorIcon}
            alt="Simulate Error"
            className="error-icon-img"
          />
        </button>
      </div>
    );
  }
}
