import { Component } from 'react';
import type { Character } from '../../api';

import './ResultsSection.css';

const ANONYMOUS_IMAGE_URL = '/placeholder.jpg';

interface ResultsSectionProps {
  results: Character[];
  isLoading: boolean;
  error: string | null;
  shouldThrowError?: boolean;
}

export class ResultsSection extends Component<ResultsSectionProps> {
  componentDidUpdate(prevProps: ResultsSectionProps) {
    if (this.props.shouldThrowError && !prevProps.shouldThrowError) {
      throw new Error('This is special error from test button');
    }
  }
  render() {
    const { results, isLoading, error } = this.props;

    if (isLoading) {
      return <div className="loading-indicator">Loading characters...</div>;
    }

    if (error) {
      return <div className="error-message">{error}</div>;
    }

    if (results.length === 0) {
      return (
        <div className="no-results">No characters found. Try another name.</div>
      );
    }

    return (
      <div className="results-list">
        {results.map((char, idx) => (
          <div key={idx} className="character-card">
            <img
              src={char.image || ANONYMOUS_IMAGE_URL}
              onError={(e) => (e.currentTarget.src = ANONYMOUS_IMAGE_URL)}
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
