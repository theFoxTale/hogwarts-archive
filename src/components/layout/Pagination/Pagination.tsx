import { FrameButton, RoundedFrame } from '@ui';
import { PAGINATION_STRINGS } from './constants';

import './Pagination.css';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  isPrevAvailable: boolean;
  isNextAvailable: boolean;
  onPrev: () => void;
  onNext: () => void;
}

export function Pagination({
  currentPage,
  totalPages,
  isPrevAvailable,
  isNextAvailable,
  onPrev,
  onNext,
}: PaginationProps) {
  return (
    <RoundedFrame className="pagination-frame variant-container">
      <div className="pagination">
        <FrameButton onClick={onPrev} disabled={!isPrevAvailable}>
          {PAGINATION_STRINGS.PREVIOUS}
        </FrameButton>
        <span className="magic-subtitle">
          {PAGINATION_STRINGS.PAGE_OF(currentPage, totalPages)}
        </span>
        <FrameButton onClick={onNext} disabled={!isNextAvailable}>
          {PAGINATION_STRINGS.NEXT}
        </FrameButton>
      </div>
    </RoundedFrame>
  );
}
