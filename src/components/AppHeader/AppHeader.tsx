import { Component } from 'react';
import { APP_STRINGS } from '../../constants';

import './AppHeader.css';

export class AppHeader extends Component {
  render() {
    return (
      <div className="app-header">
        <p className="app-name">{APP_STRINGS.APP_NAME}</p>
      </div>
    );
  }
}
