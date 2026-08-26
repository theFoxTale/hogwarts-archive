'use client';

import type { ReactNode, MouseEventHandler } from 'react';

import { RoundedFrame } from '@ui';

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
  return (
    <RoundedFrame
      className={`action-button-frame theme-primary ${disabled ? 'disabled' : ''} ${className}`}
    >
      <button className="action-button" onClick={onClick} disabled={disabled}>
        {children}
      </button>
    </RoundedFrame>
  );
}
