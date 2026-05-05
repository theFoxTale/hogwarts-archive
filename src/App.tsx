import { Component } from 'react';
import {
  SearchSection,
  ResultsSection,
  Pagination,
  ErrorBoundary,
} from './components';

import { searchCharacters } from './api';
import type { Character, PaginationInfo } from './api';

import './App.css';
import errorIcon from './assets/error.png';

const LOCAL_STORAGE_SEARCH_TEXT = 'classComponentSearchText';
const LOCAL_STORAGE_SEARCH_PAGE = 'classComponentSearchPage';

interface AppState {
  searchText: string;
  currentPage: number;
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
      currentPage: 1,
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
      const currentPage = data.pages?.pagination?.current ?? pageNumber;
      this.setState({
        currentPage: currentPage,
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

    this.setState({ searchText: searchText, currentPage: 1 });
    localStorage.setItem(LOCAL_STORAGE_SEARCH_TEXT, searchText);
    localStorage.setItem(LOCAL_STORAGE_SEARCH_PAGE, '1');

    void this.fetchCharacters(searchText);
  };

  navigateToPrevPage = () => {
    const { pages, searchText } = this.state;
    if (pages?.pagination?.prev) {
      void this.fetchCharacters(searchText, pages.pagination.prev);
      localStorage.setItem(
        LOCAL_STORAGE_SEARCH_PAGE,
        pages.pagination.prev.toString()
      );
    }
  };

  navigateToNextPage = () => {
    const { pages, searchText } = this.state;
    if (pages?.pagination?.next) {
      void this.fetchCharacters(searchText, pages.pagination.next);
      localStorage.setItem(
        LOCAL_STORAGE_SEARCH_PAGE,
        pages.pagination.next.toString()
      );
    }
  };

  simulateError = () => {
    this.setState({ shouldThrowError: true });
  };

  resetError = () => {
    this.setState({ shouldThrowError: false }, () => {
      const { searchText, currentPage } = this.state;
      void this.fetchCharacters(searchText, currentPage);
    });
  };

  render() {
    const { pages } = this.state;

    let currentPage = 0;
    let totalPages = 0;

    let isPrevAvailable = false;
    let isNextAvailable = false;

    if (pages && pages.pagination && pages.pagination.current) {
      currentPage = pages.pagination.current;
      totalPages = pages.pagination.last
        ? pages.pagination.last
        : pages.pagination.current;

      if (pages.pagination.prev) isPrevAvailable = true;
      if (pages.pagination.next) isNextAvailable = true;
    }

    return (
      <div className="app-container">
        <div className="top-controls">
          <div className="app-header">
            <p className="app-name">Harry Potter's API Test Page</p>
            <button onClick={this.simulateError} className="error-test-button">
              <img
                src={errorIcon}
                alt="Simulate Error"
                className="error-icon-img"
              />
            </button>
          </div>
          <SearchSection
            onSearch={this.handleSearch}
            initialSearchText={this.state.searchText}
          />
        </div>
        <div className="bottom-results">
          <ErrorBoundary onReset={this.resetError}>
            <ResultsSection
              results={this.state.results}
              isLoading={this.state.isLoading}
              error={this.state.error}
              shouldThrowError={this.state.shouldThrowError}
            />
          </ErrorBoundary>
        </div>
        {totalPages > 1 && !this.state.shouldThrowError && (
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
