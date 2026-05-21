import type { ReactNode, MouseEventHandler } from 'react';
import { RoundedFrame } from '../../components';

import './ActionButton.css';

interface ActionButtonProps {
  children: ReactNode;
  onClick: MouseEventHandler<HTMLButtonElement>;
  disabled?: boolean;
  className?: string;
}

export function ActionButton({
  children,
  onClick,
  disabled = false,
  className = '',
}: ActionButtonProps) {
  return (
    <RoundedFrame
      className={`action-button-frame variant-dark ${disabled ? 'disabled' : ''} ${className}`}
    >
      <button className="action-button" onClick={onClick} disabled={disabled}>
        {children}
      </button>
    </RoundedFrame>
  );
}
