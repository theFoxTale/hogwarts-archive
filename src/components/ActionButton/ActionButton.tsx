import type { ReactNode, MouseEventHandler } from 'react';
import { RoundedFrame } from '../../components';
import { useTheme } from '../../contexts';

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
