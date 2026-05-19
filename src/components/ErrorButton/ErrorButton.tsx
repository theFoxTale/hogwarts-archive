import { APP_STRINGS } from '../../constants';

import './ErrorButton.css';
import errorIcon from '../../assets/error.png';

interface ErrorButtonProps {
  onSimulateError: () => void;
}

export function ErrorButton({ onSimulateError }: ErrorButtonProps) {
  return (
    <button
      onClick={onSimulateError}
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
