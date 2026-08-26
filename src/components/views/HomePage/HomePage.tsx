'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

import {
  AppHeader,
  Flyout,
  Pagination,
  ResultsSection,
  SearchSection,
} from '@layout';
import { OrnateFrame } from '@ui';
import { CharacterDetails } from '@features';

import { useAppDispatch } from '@store';
import { clearAll } from '@store/slices';

import type { Character, PaginationInfo } from '@api';

import './HomePage.css';

interface HomePageProps {
  initialResults: Character[];
  initialPages: PaginationInfo | null;
  initialPage: number;
  initialCharacterId: string | null;
  initialSearchQuery: string;
}

export function HomePage({
  initialResults,
  initialPages,
  initialPage,
  initialCharacterId,
  initialSearchQuery,
}: HomePageProps) {
  const router = useRouter();
  const dispatch = useAppDispatch();

  const [results, setResults] = useState(initialResults);
  const [pages, setPages] = useState(initialPages);
  const [currentPage, setCurrentPage] = useState(initialPage);
  const [characterId, setCharacterId] = useState<string | null>(
    initialCharacterId
  );
  const [searchQuery, setSearchQuery] = useState(initialSearchQuery);
  const [inputValue, setInputValue] = useState(initialSearchQuery);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Функция обновления данных через server action
  const updateData = async (newPage: number, newSearchQuery: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const { searchCharactersAction } = await import('@/actions/characters');

      const data = await searchCharactersAction(newSearchQuery, newPage);

      setResults(data.items);
      setPages(data.pages);
      setCurrentPage(newPage);

      // обновляем URL
      const params = new URLSearchParams();
      params.set('page', String(newPage));
      if (newSearchQuery) params.set('q', newSearchQuery);
      if (characterId) params.set('characterId', characterId);

      router.push(`/?${params.toString()}`);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = (text: string) => {
    if (text === searchQuery) return;

    dispatch(clearAll());

    setSearchQuery(text);
    setInputValue(text);
    setCharacterId(null);

    void updateData(1, text);
  };

  const handlePageChange = (newPage: number) => {
    dispatch(clearAll());
    setCharacterId(null);
    void updateData(newPage, searchQuery);
  };

  const handleRefresh = () => {
    void updateData(currentPage, searchQuery);
  };

  const handleCharacterSelect = (id: string) => {
    setCharacterId(id);

    const params = new URLSearchParams();
    params.set('page', String(currentPage));

    if (searchQuery) params.set('q', searchQuery);
    params.set('characterId', id);

    router.push(`/?${params.toString()}`);
  };

  const handleCloseDetails = () => {
    setCharacterId(null);

    const params = new URLSearchParams();
    params.set('page', String(currentPage));

    if (searchQuery) params.set('q', searchQuery);

    router.push(`/?${params.toString()}`);
  };

  const navigateToPrevPage = () => {
    const prev = pages?.pagination?.prev;
    if (prev) handlePageChange(prev);
  };

  const navigateToNextPage = () => {
    const next = pages?.pagination?.next;
    if (next) handlePageChange(next);
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
            error={error}
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
        {totalPages > 1 && !error && (
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
