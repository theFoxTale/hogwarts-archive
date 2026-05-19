import { type ReactNode } from 'react';
import './RoundedFrame.css';

interface RoundedFrameProps {
  children: ReactNode;
  className?: string;
}

export function RoundedFrame({ children, className = '' }: RoundedFrameProps) {
  return (
    <div className={`rounded-frame ${className}`}>
      {/* Уголки */}
      <span className="rounded-corner rounded-corner-top-left" />
      <span className="rounded-corner rounded-corner-top-right" />
      <span className="rounded-corner rounded-corner-bottom-left" />
      <span className="rounded-corner rounded-corner-bottom-right" />

      {/* Линии */}
      <span className="rounded-line rounded-line-top" />
      <span className="rounded-line rounded-line-bottom" />
      <span className="rounded-line rounded-line-left" />
      <span className="rounded-line rounded-line-right" />

      <div className="rounded-frame-content">{children}</div>
    </div>
  );
}
