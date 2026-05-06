import { Component, type ReactNode } from 'react';
import { ERROR_MESSAGES, UI_MESSAGES } from '../../constants';

import './ErrorBoundary.css';

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
    console.error(ERROR_MESSAGES.BOUNDARY, error, errorInfo);
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
          <h2>{UI_MESSAGES.FALLBACK_TITLE}</h2>
          <p>{this.state.errorMessage || ERROR_MESSAGES.UNKNOWN}</p>
          <button onClick={this.handleReset}>{UI_MESSAGES.TRY_AGAIN}</button>
        </div>
      );
    }
    return this.props.children;
  }
}
