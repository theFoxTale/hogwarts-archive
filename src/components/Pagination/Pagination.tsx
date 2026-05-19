import { Component } from 'react';
import { RoundedFrame } from '../RoundedFrame/RoundedFrame';

import './Pagination.css';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  isPrevAvailable: boolean;
  isNextAvailable: boolean;
  onPrev: () => void;
  onNext: () => void;
}

export class Pagination extends Component<PaginationProps> {
  render() {
    const {
      currentPage,
      totalPages,
      isPrevAvailable,
      isNextAvailable,
      onPrev,
      onNext,
    } = this.props;

    return (
      <RoundedFrame className="pagination-frame">
        <div className="pagination">
          <RoundedFrame
            className={`pagination-button-frame ${
              !isPrevAvailable ? 'disabled' : ''
            }`}
          >
            <button onClick={onPrev} disabled={!isPrevAvailable}>
              ← Previous
            </button>
          </RoundedFrame>
          <span className="page-info-title magic-title">
            Page {currentPage} of {totalPages}
          </span>
          <RoundedFrame
            className={`pagination-button-frame ${
              !isNextAvailable ? 'disabled' : ''
            }`}
          >
            <button onClick={onNext} disabled={!isNextAvailable}>
              Next →
            </button>
          </RoundedFrame>
        </div>
      </RoundedFrame>
    );
  }
}
