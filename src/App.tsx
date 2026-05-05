import { Component } from 'react';
import { SearchSection, ResultsSection, Pagination } from './components';

import { searchCharacters } from './api';
import type { Character, PaginationInfo } from './api';

import './App.css';

const LOCAL_STORAGE_URL = 'classComponentSearchText';

interface AppState {
  searchText: string;
  results: Character[];
  pages: PaginationInfo | null;
  isLoading: boolean;
  error: string | null;
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
    };
  }

  componentDidMount() {
    const savedSearchText = localStorage.getItem(LOCAL_STORAGE_URL);

    if (savedSearchText) {
      this.setState({ searchText: savedSearchText }, () => {
        void this.fetchCharacters(savedSearchText);
      });
    } else {
      void this.fetchCharacters('');
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
    localStorage.setItem(LOCAL_STORAGE_URL, searchText);

    void this.fetchCharacters(searchText);
  };

  navigateToPrevPage = () => {
    const { pages, searchText } = this.state;
    if (pages?.pagination?.prev) {
      void this.fetchCharacters(searchText, pages.pagination.prev);
    }
  };

  navigateToNextPage = () => {
    const { pages, searchText } = this.state;
    if (pages?.pagination?.next) {
      void this.fetchCharacters(searchText, pages.pagination.next);
    }
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
          <p className="app-name">Harry Potter's API Test Page</p>
          <SearchSection
            onSearch={this.handleSearch}
            initialSearchText={this.state.searchText}
          />
        </div>
        <div className="bottom-results">
          <ResultsSection
            results={this.state.results}
            isLoading={this.state.isLoading}
            error={this.state.error}
          />
        </div>
        {totalPages > 1 && (
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
