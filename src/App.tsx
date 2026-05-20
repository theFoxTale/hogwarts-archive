import { useState, useEffect, useCallback } from 'react';

import {
  SearchSection,
  ResultsSection,
  Pagination,
  ErrorBoundary,
  AppHeader,
  ErrorButton,
  OrnateFrame,
} from './components';

import { LOADING_DELAY, LOCAL_STORAGE_KEYS } from './constants';
import { searchCharacters } from './api';
import type { Character, PaginationInfo } from './api';
import { useLocalStorage } from './hooks';

import './App.css';

export function App() {
  const [searchQuery, setSearchQuery] = useLocalStorage(
    LOCAL_STORAGE_KEYS.SEARCH_TEXT,
    ''
  );

  const [page, setPage] = useLocalStorage(LOCAL_STORAGE_KEYS.SEARCH_PAGE, 1);

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
      void fetchCharacters(searchQuery, page);
    });
  }, [fetchCharacters, searchQuery, page]);

  const handleSearch = (searchText: string) => {
    if (searchText === searchQuery) {
      return;
    }

    setSearchQuery(searchText);
    setInputValue(searchText);
    setPage(1);
  };

  const navigateToPrevPage = () => {
    const prevPage = pages?.pagination?.prev;

    if (prevPage) {
      setPage(prevPage);
    }
  };

  const navigateToNextPage = () => {
    const nextPage = pages?.pagination?.next;

    if (nextPage) {
      setPage(nextPage);
    }
  };

  const simulateError = () => {
    setShouldThrowError(true);
  };

  const resetError = () => {
    setShouldThrowError(false);

    const currentPage = pages?.pagination?.current ?? page;

    void fetchCharacters(searchQuery, currentPage);
  };

  const currentPage = pages?.pagination?.current ?? page;

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

      <div className="bottom-results">
        <ErrorBoundary onReset={resetError}>
          <ResultsSection
            results={results}
            isLoading={isLoading}
            error={error}
            shouldThrowError={shouldThrowError}
          />
        </ErrorBoundary>
      </div>

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

      <ErrorButton onSimulateError={simulateError} />
    </div>
  );
}
