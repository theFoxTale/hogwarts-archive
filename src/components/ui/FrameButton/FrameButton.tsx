'use client';

import type { ReactNode, MouseEventHandler } from 'react';

import { RoundedFrame } from '@ui';
import { useTheme } from '@contexts';

import './FrameButton.css';

interface FrameButtonProps {
  children: ReactNode;
  onClick?: MouseEventHandler<HTMLButtonElement>;
  disabled?: boolean;
  className?: string;
}

export function FrameButton({
  children,
  onClick,
  disabled = false,
  className = '',
}: FrameButtonProps) {
  const { theme } = useTheme();
  const variant = theme === 'light' ? 'variant-gold' : 'variant-dark';

  return (
    <RoundedFrame
      className={`action-button-frame ${variant} ${disabled ? 'disabled' : ''} ${className}`}
    >
      <button className="action-button" onClick={onClick} disabled={disabled}>
        {children}
      </button>
    </RoundedFrame>
  );
}
