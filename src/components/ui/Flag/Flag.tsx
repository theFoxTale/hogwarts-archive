import { useThemeImages } from '@hooks';
import type { FlagProps } from './types';

import './Flag.css';

export function Flag({
  onClick,
  topImage,
  middleBackground,
  bottomImage,
  icon,
  text,
  alt,
  className = '',
}: FlagProps) {
  const topSrc = useThemeImages(topImage);
  const middleSrc = useThemeImages(middleBackground);
  const bottomSrc = useThemeImages(bottomImage);
  const iconSrc = useThemeImages(icon);

  return (
    <div className={`flag ${className}`} onClick={onClick}>
      <div className="flag-top">
        <img src={topSrc} alt={alt} />
      </div>
      <div
        className="flag-middle"
        style={{ backgroundImage: `url(${middleSrc})` }}
      >
        <img src={iconSrc} className="flag-icon" alt={alt} />
        <span className="flag-text magic-title">{text}</span>
      </div>
      <div className="flag-bottom">
        <img src={bottomSrc} alt={alt} />
      </div>
    </div>
  );
}
