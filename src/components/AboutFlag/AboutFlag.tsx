import { useNavigate } from 'react-router-dom';

import { ABOUT_STRINGS } from '../../constants';
import { Flag } from '../../components';

import './AboutFlag.css';

// изображения для светлой темы
import flagTopLight from '../../assets/images/flag/light/flag-top.png';
import flagMiddleLight from '../../assets/images/flag/light/flag-middle.png';
import flagBottomLight from '../../assets/images/flag/light/flag-bottom.png';

// изображения для тёмной темы
import flagTopDark from '../../assets/images/flag/dark/flag-top.png';
import flagMiddleDark from '../../assets/images/flag/dark/flag-middle.png';
import flagBottomDark from '../../assets/images/flag/dark/flag-bottom.png';

import aboutIcon from '../../assets/images/flag/about-icon.png';

export function AboutFlag() {
  const navigate = useNavigate();

  return (
    <Flag
      onClick={() => navigate('/about')}
      topImage={{ light: flagTopLight, dark: flagTopDark }}
      middleBackground={{ light: flagMiddleLight, dark: flagMiddleDark }}
      bottomImage={{ light: flagBottomLight, dark: flagBottomDark }}
      icon={{ light: aboutIcon, dark: aboutIcon }}
      text={ABOUT_STRINGS.TEXT}
      alt="About"
      className="about-flag"
    />
  );
}
