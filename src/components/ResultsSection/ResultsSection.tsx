import { Component } from 'react';
import type { Character } from '../../api';
import { CharacterCard } from '../CharacterCard/CharacterCard';
import { UI_MESSAGES, ERROR_MESSAGES } from '../../constants';

import './ResultsSection.css';

interface ResultsSectionProps {
  results: Character[];
  isLoading: boolean;
  error: string | null;
  shouldThrowError?: boolean;
}

export class ResultsSection extends Component<ResultsSectionProps> {
  componentDidUpdate(prevProps: ResultsSectionProps) {
    if (
      !this.props.isLoading &&
      this.props.shouldThrowError &&
      !prevProps.shouldThrowError
    ) {
      throw new Error(ERROR_MESSAGES.TEST);
    }
  }

  render() {
    const { results, isLoading, error } = this.props;

    if (isLoading) {
      return <div className="loading-indicator">{UI_MESSAGES.LOADING}</div>;
    }

    if (error) {
      return <div className="error-message">{error}</div>;
    }

    if (results.length === 0) {
      return <div className="no-results">{UI_MESSAGES.NO_RESULTS}</div>;
    }

    return (
      <div className="results-list">
        {results.map((character, idx) => (
          <CharacterCard key={idx} character={character} />
        ))}
      </div>
    );
  }
}
