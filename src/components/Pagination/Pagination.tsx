import { Component } from 'react';

import './Pagination.css';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
}

export class Pagination extends Component<PaginationProps> {
  render() {
    const { currentPage, totalPages } = this.props;

    return (
      <div className="pagination">
        <button>← Previous</button>
        <span className="page-info">
          Page {currentPage} of {totalPages}
        </span>
        <button>Next →</button>
      </div>
    );
  }
}
