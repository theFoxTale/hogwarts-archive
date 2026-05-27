import { useNavigate } from 'react-router-dom';
import { ABOUT_STRINGS } from '../../constants';

import './AboutFlag.css';

import flagTopDark from '../../assets/images/flag/dark/flag-top.png';
import flagMiddleDark from '../../assets/images/flag/dark/flag-middle.png';
import flagBottomDark from '../../assets/images/flag/dark/flag-bottom.png';

import flagTopLight from '../../assets/images/flag/light/flag-top.png';
import flagMiddleLight from '../../assets/images/flag/light/flag-middle.png';
import flagBottomLight from '../../assets/images/flag/light/flag-bottom.png';

import aboutIcon from '../../assets/images/flag/about-icon.png';
import { useTheme } from '../../contexts';

export function AboutFlag() {
  const navigate = useNavigate();
  const { theme } = useTheme();

  return (
    <div className="about-flag" onClick={() => navigate('/about')}>
      <div className="flag-top">
        <img src={theme === 'light' ? flagTopLight : flagTopDark} alt="" />
      </div>
      <div
        className="flag-middle"
        style={{
          backgroundImage: `url(${theme === 'light' ? flagMiddleLight : flagMiddleDark})`,
        }}
      >
        <img src={aboutIcon} alt="" className="flag-icon" />
        <span className="flag-text magic-title">{ABOUT_STRINGS.TEXT}</span>
      </div>
      <div className="flag-bottom">
        <img
          src={theme === 'light' ? flagBottomLight : flagBottomDark}
          alt=""
        />
      </div>
    </div>
  );
}
