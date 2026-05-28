import { useState, useEffect, useCallback } from 'react';
import { Outlet, useParams, useNavigate } from 'react-router-dom';

import {
  AppHeader,
  ErrorBoundary,
  Flyout,
  Pagination,
  ResultsSection,
  SearchSection,
} from '@layout';
import { OrnateFrame } from '@ui';
import { ErrorButton } from '@features';

import { LOADING_DELAY, LOCAL_STORAGE_KEYS } from '@constants';
import { searchCharacters } from '@api';
import type { Character, PaginationInfo } from '@api';
import { useLocalStorage } from '@hooks';

import './HomePage.css';

export function HomePage() {
  const navigate = useNavigate();
  const { page = '1', characterId } = useParams<{
    page?: string;
    characterId?: string;
  }>();
  const currentPage = parseInt(page, 10);

  const [searchQuery, setSearchQuery] = useLocalStorage(
    LOCAL_STORAGE_KEYS.SEARCH_TEXT,
    ''
  );
  const [inputValue, setInputValue] = useState(searchQuery);

  const [results, setResults] = useState<Character[]>([]);
  const [pages, setPages] = useState<PaginationInfo | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [shouldThrowError, setShouldThrowError] = useState(false);

  const fetchCharacters = useCallback(
    async (searchText: string, pageNumber: number) => {
      setIsLoading(true);
      setError(null);

      if (LOADING_DELAY.IS_SIMULATED) {
        await new Promise((resolve) =>
          setTimeout(resolve, LOADING_DELAY.TIME_MS)
        );
      }

      try {
        const data = await searchCharacters(searchText, pageNumber);

        setResults(data.items);
        setPages(data.pages);
      } catch (err) {
        setError(err instanceof Error ? err.message : String(err));
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  useEffect(() => {
    queueMicrotask(() => {
      void fetchCharacters(searchQuery, currentPage);
    });
  }, [fetchCharacters, searchQuery, currentPage]);

  const handlePageChange = (newPage: number) => {
    navigate(`/${newPage}`);
  };

  const handleSearch = (searchText: string) => {
    if (searchText === searchQuery) return;

    setSearchQuery(searchText);
    setInputValue(searchText);

    navigate(`/1`);
  };

  const navigateToPrevPage = () => {
    const prevPage = pages?.pagination?.prev;
    if (prevPage) handlePageChange(prevPage);
  };

  const navigateToNextPage = () => {
    const nextPage = pages?.pagination?.next;
    if (nextPage) handlePageChange(nextPage);
  };

  const simulateError = () => setShouldThrowError(true);

  const resetError = () => {
    setShouldThrowError(false);
    void fetchCharacters(searchQuery, currentPage);
  };

  const totalPages = pages?.pagination?.last ?? currentPage;
  const isPrevAvailable = !!pages?.pagination?.prev;
  const isNextAvailable = !!pages?.pagination?.next;

  return (
    <div className="app-container">
      <AppHeader />

      <OrnateFrame className="variant-container">
        <SearchSection
          value={inputValue}
          onChange={setInputValue}
          onSearch={handleSearch}
        />
      </OrnateFrame>

      <div className={`homepage-layout ${characterId ? 'has-details' : ''}`}>
        <div className="results-panel">
          <ErrorBoundary onReset={resetError}>
            <ResultsSection
              results={results}
              isLoading={isLoading}
              error={error}
              shouldThrowError={shouldThrowError}
              currentPage={currentPage}
            />
          </ErrorBoundary>
        </div>
        <div className="details-panel">
          <Outlet />
        </div>
      </div>

      <div className="app-footer">
        <Flyout />
        {totalPages > 1 && !shouldThrowError && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            isPrevAvailable={isPrevAvailable}
            isNextAvailable={isNextAvailable}
            onPrev={navigateToPrevPage}
            onNext={navigateToNextPage}
          />
        )}
      </div>

      <ErrorButton onSimulateError={simulateError} />
    </div>
  );
}
