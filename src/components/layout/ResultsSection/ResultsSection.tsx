import { useEffect } from 'react';

import type { Character } from '@api';
import { CharacterCard } from '@features';

import { RESULTS_STRING } from './constants';

import './ResultsSection.css';

interface ResultsSectionProps {
  results: Character[];
  isLoading: boolean;
  error: string | null;
  shouldThrowError?: boolean;
  currentPage: number;
}

export function ResultsSection({
  results,
  isLoading,
  error,
  shouldThrowError,
  currentPage,
}: ResultsSectionProps) {
  useEffect(() => {
    if (!isLoading && shouldThrowError) {
      throw new Error(RESULTS_STRING.TEST_BUTTON);
    }
  }, [isLoading, shouldThrowError]);

  if (isLoading) {
    return <div className="loading-indicator">{RESULTS_STRING.LOADING}</div>;
  }

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  if (results.length === 0) {
    return <div className="no-results">{RESULTS_STRING.NO_RESULTS}</div>;
  }

  return (
    <div className="results-list">
      {results.map((character) => (
        <CharacterCard
          key={character.id}
          character={character}
          currentPage={currentPage}
        />
      ))}
    </div>
  );
}
