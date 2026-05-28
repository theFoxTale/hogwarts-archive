import { ERROR_STRINGS } from '@constants';
import { Flag } from '@ui';

import './ErrorFlag.css';

import flagTopLight from '../../../../assets/images/rounded-flag/flag-top.png';
import flagMiddleLight from '../../../../assets/images/rounded-flag/flag-middle.png';
import flagBottomLight from '../../../../assets/images/rounded-flag/flag-bottom.png';

// изображения для тёмной темы
const flagTopDark = flagTopLight;
const flagMiddleDark = flagMiddleLight;
const flagBottomDark = flagBottomLight;

import errorIcon from '../../../../assets/images/rounded-flag/error-icon.png';

interface ErrorFlagProps {
  onSimulateError: () => void;
}

export function ErrorFlag({ onSimulateError }: ErrorFlagProps) {
  return (
    <Flag
      onClick={onSimulateError}
      topImage={{ light: flagTopLight, dark: flagTopDark }}
      middleBackground={{ light: flagMiddleLight, dark: flagMiddleDark }}
      bottomImage={{ light: flagBottomLight, dark: flagBottomDark }}
      icon={{
        light: errorIcon,
        dark: errorIcon,
      }}
      text={ERROR_STRINGS.TEXT}
      alt={ERROR_STRINGS.ALT_TEXT}
      className="error-flag"
    />
  );
}
