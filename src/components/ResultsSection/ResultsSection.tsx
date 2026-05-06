import { Component } from 'react';
import type { Character } from '../../api';
import { ANONYMOUS_IMAGE, UI_MESSAGES } from '../../constants';

import './ResultsSection.css';

interface ResultsSectionProps {
  results: Character[];
  isLoading: boolean;
  error: string | null;
  shouldThrowError?: boolean;
}

export class ResultsSection extends Component<ResultsSectionProps> {
  componentDidUpdate(prevProps: ResultsSectionProps) {
    if (this.props.shouldThrowError && !prevProps.shouldThrowError) {
      throw new Error(UI_MESSAGES.TEST_ERROR);
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
        {results.map((char, idx) => (
          <div key={idx} className="character-card">
            <img
              src={char.image || ANONYMOUS_IMAGE}
              onError={(e) => (e.currentTarget.src = ANONYMOUS_IMAGE)}
              alt={char.name}
              className="character-image"
            />
            <div className="character-info">
              <h3 className="character-name">{char.name}</h3>
              <div className="character-details">
                {char.house && (
                  <p>
                    <strong>House:</strong> {char.house}
                  </p>
                )}
                {char.species && (
                  <p>
                    <strong>Species:</strong> {char.species}
                  </p>
                )}
                {char.gender && (
                  <p>
                    <strong>Gender:</strong> {char.gender}
                  </p>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }
}
