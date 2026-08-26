'use client';

import Image from 'next/image';
import type { CSSProperties } from 'react';
import type { FlagProps, ThemeImages } from './types';

import './Flag.css';

function ThemeImage({
  sources,
  alt,
  width,
  height,
  className,
  style,
}: {
  sources: ThemeImages;
  alt: string;
  width: number;
  height: number;
  className?: string;
  style?: CSSProperties;
}) {
  const imageStyle = { width: '100%', height: 'auto', ...style };

  if (sources.light === sources.dark) {
    return (
      <Image
        src={sources.light}
        alt={alt}
        width={width}
        height={height}
        className={className}
        style={imageStyle}
      />
    );
  }

  return (
    <>
      <Image
        src={sources.light}
        alt={alt}
        width={width}
        height={height}
        className={`theme-layer theme-layer--light ${className ?? ''}`.trim()}
        style={imageStyle}
      />
      <Image
        src={sources.dark}
        alt=""
        width={width}
        height={height}
        className={`theme-layer theme-layer--dark ${className ?? ''}`.trim()}
        style={imageStyle}
        aria-hidden="true"
      />
    </>
  );
}

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
  const middleStyle = {
    '--flag-middle-light': `url(${middleBackground.light})`,
    '--flag-middle-dark': `url(${middleBackground.dark})`,
  } as CSSProperties;

  return (
    <div className={`flag ${className}`} onClick={onClick}>
      <div className="flag-top">
        <ThemeImage sources={topImage} alt={alt} width={90} height={24} />
      </div>
      <div className="flag-middle" style={middleStyle}>
        <ThemeImage
          sources={icon}
          alt={alt}
          width={36}
          height={36}
          className="flag-icon"
          style={{ width: '50%' }}
        />
        <span className="flag-text magic-title">{text}</span>
      </div>
      <div className="flag-bottom">
        <ThemeImage sources={bottomImage} alt={alt} width={90} height={24} />
      </div>
    </div>
  );
}
