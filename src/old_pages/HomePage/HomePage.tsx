import { useState } from 'react';
import { Outlet, useParams, useNavigate } from 'react-router-dom';

import {
  AppHeader,
  Flyout,
  Pagination,
  ResultsSection,
  SearchSection,
} from '@layout';
import { OrnateFrame } from '@ui';

import { LOCAL_STORAGE_KEYS } from './constants';

import { useSearchCharactersQuery } from '@api';
import { useLocalStorage } from '@hooks';

import { useAppDispatch } from '@store';
import { clearAll } from '@store/slices';

import './HomePage.css';

export function HomePage() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

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

  const { data, isLoading, isError, error, refetch } = useSearchCharactersQuery(
    { name: searchQuery, page: currentPage },
    { skip: false }
  );

  const results = data?.items ?? [];
  const pages = data?.pages ?? null;
  const apiError = isError ? (error as Error)?.message : null;

  const handlePageChange = (newPage: number) => {
    navigate(`/${newPage}`);
  };

  const handleSearch = (searchText: string) => {
    if (searchText === searchQuery) return;

    dispatch(clearAll());

    setSearchQuery(searchText);
    setInputValue(searchText);

    navigate(`/1`);
  };

  const handleRefresh = () => {
    refetch();
  };

  const navigateToPrevPage = () => {
    const prevPage = pages?.pagination?.prev;
    if (prevPage) handlePageChange(prevPage);
  };

  const navigateToNextPage = () => {
    const nextPage = pages?.pagination?.next;
    if (nextPage) handlePageChange(nextPage);
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
          onRefresh={handleRefresh}
        />
      </OrnateFrame>

      <div className={`homepage-layout ${characterId ? 'has-details' : ''}`}>
        <div className="results-panel">
          <ResultsSection
            results={results}
            isLoading={isLoading}
            error={apiError}
            currentPage={currentPage}
          />
        </div>
        <div className="details-panel">
          <Outlet />
        </div>
      </div>

      <div className="app-footer">
        <Flyout />
        {totalPages > 1 && !isError && (
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
    </div>
  );
}
