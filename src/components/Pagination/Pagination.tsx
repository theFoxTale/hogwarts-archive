import { ActionButton, RoundedFrame } from '../../components';

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
        <ActionButton onClick={onPrev} disabled={!isPrevAvailable}>
          ← Previous
        </ActionButton>
        <span className="page-info-title magic-subtitle">
          Page {currentPage} of {totalPages}
        </span>
        <ActionButton onClick={onNext} disabled={!isNextAvailable}>
          Next →
        </ActionButton>
      </div>
    </RoundedFrame>
  );
}
