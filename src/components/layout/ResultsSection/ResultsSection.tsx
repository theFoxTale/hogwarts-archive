import { useTranslations } from 'next-intl';

import type { Character } from '@api';
import { CharacterCard } from '@features';

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
  currentPage,
}: ResultsSectionProps) {
  const lang = useTranslations('results');

  if (isLoading) {
    return <div className="loading-indicator">{lang('loading')}</div>;
  }

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  if (results.length === 0) {
    return <div className="no-results">{lang('noResults')}</div>;
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
