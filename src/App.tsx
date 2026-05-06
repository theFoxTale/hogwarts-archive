import { Component } from 'react';
import {
  SearchSection,
  ResultsSection,
  Pagination,
  ErrorBoundary,
  AppHeader,
} from './components';

import { searchCharacters } from './api';
import type { Character, PaginationInfo } from './api';

import './App.css';

const LOCAL_STORAGE_SEARCH_TEXT = 'classComponentSearchText';
const LOCAL_STORAGE_SEARCH_PAGE = 'classComponentSearchPage';

interface AppState {
  searchText: string;
  results: Character[];
  pages: PaginationInfo | null;
  isLoading: boolean;
  error: string | null;
  shouldThrowError: boolean;
}

export class App extends Component<object, AppState> {
  constructor(props: object) {
    super(props);
    this.state = {
      searchText: '',
      results: [],
      pages: null,
      isLoading: false,
      error: null,
      shouldThrowError: false,
    };
  }

  componentDidMount() {
    const savedSearchText = localStorage.getItem(LOCAL_STORAGE_SEARCH_TEXT);
    const savedSearchPage = localStorage.getItem(LOCAL_STORAGE_SEARCH_PAGE);
    const pageNumber = savedSearchPage ? parseInt(savedSearchPage) : 1;

    if (savedSearchText) {
      this.setState({ searchText: savedSearchText }, () => {
        void this.fetchCharacters(savedSearchText, pageNumber);
      });
    } else {
      void this.fetchCharacters('', pageNumber);
    }
  }

  fetchCharacters = async (searchText: string, pageNumber: number = 1) => {
    this.setState({ isLoading: true, error: null });

    try {
      const data = await searchCharacters(searchText, pageNumber);
      this.setState({
        results: data.items,
        pages: data.pages,
        isLoading: false,
      });
    } catch (err) {
      this.setState({
        error: 'Failed to load characters. Please try again later.',
        isLoading: false,
      });

      console.error(err);
    }
  };

  handleSearch = (searchText: string) => {
    if (searchText === this.state.searchText) return;

    this.setState({ searchText: searchText });
    localStorage.setItem(LOCAL_STORAGE_SEARCH_TEXT, searchText);
    localStorage.setItem(LOCAL_STORAGE_SEARCH_PAGE, '1');

    void this.fetchCharacters(searchText, 1);
  };

  navigateToPrevPage = () => {
    const { pages, searchText } = this.state;
    const prevPage = pages?.pagination?.prev;
    if (prevPage) {
      void this.fetchCharacters(searchText, prevPage);
      localStorage.setItem(LOCAL_STORAGE_SEARCH_PAGE, prevPage.toString());
    }
  };

  navigateToNextPage = () => {
    const { pages, searchText } = this.state;
    const nextPage = pages?.pagination?.next;
    if (nextPage) {
      void this.fetchCharacters(searchText, nextPage);
      localStorage.setItem(LOCAL_STORAGE_SEARCH_PAGE, nextPage.toString());
    }
  };

  simulateError = () => {
    this.setState({ shouldThrowError: true });
  };

  resetError = () => {
    const { searchText, pages } = this.state;
    const currentPage = pages?.pagination?.current ?? 1;
    this.setState({ shouldThrowError: false }, () => {
      void this.fetchCharacters(searchText, currentPage);
    });
  };

  render() {
    const { pages, isLoading, shouldThrowError, error, results, searchText } =
      this.state;

    const currentPage = pages?.pagination?.current ?? 1;
    const totalPages = pages?.pagination?.last ?? 1;
    const isPrevAvailable = !!pages?.pagination?.prev;
    const isNextAvailable = !!pages?.pagination?.next;

    return (
      <div className="app-container">
        <div className="top-controls">
          <AppHeader onSimulateError={this.simulateError} />
          <SearchSection
            onSearch={this.handleSearch}
            initialSearchText={searchText}
          />
        </div>
        <div className="bottom-results">
          <ErrorBoundary onReset={this.resetError}>
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
            onPrev={this.navigateToPrevPage}
            onNext={this.navigateToNextPage}
          />
        )}
      </div>
    );
  }
}
