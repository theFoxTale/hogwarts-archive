'use client';

import Image from 'next/image';
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
        <Image
          src={topSrc}
          alt={alt}
          width={90}
          height={24}
          style={{ width: '100%', height: 'auto' }}
        />
      </div>
      <div
        className="flag-middle"
        style={{ backgroundImage: `url(${middleSrc})` }}
      >
        <Image
          src={iconSrc}
          className="flag-icon"
          alt={alt}
          width={36}
          height={36}
          style={{ width: '50%', height: 'auto' }}
        />
        <span className="flag-text magic-title">{text}</span>
      </div>
      <div className="flag-bottom">
        <Image
          src={bottomSrc}
          alt={alt}
          width={90}
          height={24}
          style={{ width: '100%', height: 'auto' }}
        />
      </div>
    </div>
  );
}
