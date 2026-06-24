import { useTranslations } from 'next-intl';
import { FrameButton, RoundedFrame } from '@ui';

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
  const lang = useTranslations('pagination');

  return (
    <RoundedFrame className="pagination-frame variant-container">
      <div className="pagination">
        <FrameButton onClick={onPrev} disabled={!isPrevAvailable}>
          {lang('previous')}
        </FrameButton>
        <span className="magic-subtitle">
          {lang('pageOf', { current: currentPage, total: totalPages })}
        </span>
        <FrameButton onClick={onNext} disabled={!isNextAvailable}>
          {lang('next')}
        </FrameButton>
      </div>
    </RoundedFrame>
  );
}
