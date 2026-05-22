import { useNavigate } from 'react-router-dom';

import './AboutFlag.css';
import flagTop from '../../assets/images/flag/flag-top.png';
import flagMiddle from '../../assets/images/flag/flag-middle.png';
import flagBottom from '../../assets/images/flag/flag-bottom.png';
import aboutIcon from '../../assets/images/flag/about-icon.png';

export function AboutFlag() {
  const navigate = useNavigate();

  return (
    <div className="about-flag" onClick={() => navigate('/about')}>
      <div className="flag-top">
        <img src={flagTop} alt="" />
      </div>
      <div
        className="flag-middle"
        style={{ backgroundImage: `url(${flagMiddle})` }}
      >
        <img src={aboutIcon} alt="" className="flag-icon" />
        <span className="flag-text magic-title">ABOUT</span>
      </div>
      <div className="flag-bottom">
        <img src={flagBottom} alt="" />
      </div>
    </div>
  );
}
