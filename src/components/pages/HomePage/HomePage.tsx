import { useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';

import {
  AppHeader,
  Flyout,
  Pagination,
  ResultsSection,
  SearchSection,
} from '@layout';
import { OrnateFrame } from '@ui';
import { CharacterDetails } from '@features';

import { LOCAL_STORAGE_KEYS } from './constants';

import { useSearchCharactersQuery } from '@api';
import { useLocalStorage } from '@hooks';

import { useAppDispatch } from '@store';
import { clearAll } from '@store/slices';

import './HomePage.css';

export function HomePage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Читаем page и characterId из query-параметров
  const pageParam = searchParams.get('page') || '1';
  const characterIdParam = searchParams.get('characterId') || undefined;

  const currentPage = parseInt(pageParam, 10);
  const characterId = characterIdParam;

  const dispatch = useAppDispatch();

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

  // Обновление URL при смене страницы
  const updateUrl = (page: number, charId?: string) => {
    const params = new URLSearchParams();
    params.set('page', String(page));
    if (charId) params.set('characterId', charId);
    if (searchQuery) params.set('q', searchQuery); // можно добавить, если хотим сохранять поиск в URL
    router.push(`/?${params.toString()}`);
  };

  const handlePageChange = (newPage: number) => {
    dispatch(clearAll());
    updateUrl(newPage, characterId);
  };

  const handleSearch = (searchText: string) => {
    if (searchText === searchQuery) return;
    dispatch(clearAll());
    setSearchQuery(searchText);
    setInputValue(searchText);
    updateUrl(1, undefined);
  };

  const handleRefresh = () => {
    refetch();
  };

  const handleCharacterSelect = (id: string) => {
    updateUrl(currentPage, id);
  };

  const handleCloseDetails = () => {
    updateUrl(currentPage, undefined);
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
            onSelectCharacter={handleCharacterSelect}
          />
        </div>
        <div className="details-panel">
          {characterId && (
            <CharacterDetails
              characterId={characterId}
              onClose={handleCloseDetails}
            />
          )}
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
