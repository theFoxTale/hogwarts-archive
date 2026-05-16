import { Component } from 'react';

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
      <div className="pagination glass-panel">
        <button onClick={onPrev} disabled={!isPrevAvailable}>
          ← Previous
        </button>
        <span className="page-info">
          Page {currentPage} of {totalPages}
        </span>
        <button onClick={onNext} disabled={!isNextAvailable}>
          Next →
        </button>
      </div>
    );
  }
}
