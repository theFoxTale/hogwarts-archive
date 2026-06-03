import { Component, type ReactNode } from 'react';
import { ERROR_BOUNDARY_STRINGS } from './constants';

import './ErrorBoundary.css';
import * as React from 'react';

interface ErrorBoundaryProps {
  children: ReactNode;
  onReset?: () => void;
}

interface ErrorBoundaryState {
  hasError: boolean;
  errorMessage: string | null;
}

export class ErrorBoundary extends Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, errorMessage: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, errorMessage: error.message };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error(ERROR_BOUNDARY_STRINGS.BOUNDARY, error, errorInfo);
  }

  handleReset = () => {
    this.setState({ hasError: false, errorMessage: null });
    if (this.props.onReset) {
      this.props.onReset();
    }
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="error-fallback">
          <h2>{ERROR_BOUNDARY_STRINGS.FALLBACK_TITLE}</h2>
          <p>{this.state.errorMessage || ERROR_BOUNDARY_STRINGS.UNKNOWN}</p>
          <button onClick={this.handleReset}>
            {ERROR_BOUNDARY_STRINGS.TRY_AGAIN}
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}
