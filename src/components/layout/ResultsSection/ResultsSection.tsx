import { useEffect, useRef } from 'react';
import type { Character } from '@api';
import { CharacterCard } from '@features';
import { UI_MESSAGES, ERROR_MESSAGES } from '@constants';

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
  const prevShouldThrowErrorRef = useRef(shouldThrowError);

  useEffect(() => {
    if (!isLoading && shouldThrowError && !prevShouldThrowErrorRef.current) {
      throw new Error(ERROR_MESSAGES.TEST);
    }
    prevShouldThrowErrorRef.current = shouldThrowError;
  }, [isLoading, shouldThrowError]);

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
