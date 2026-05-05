import { Component } from 'react';
import { SearchSection, ResultsSection } from './components';
import { searchCharacters, type Character } from './api';

import './App.css';

const LOCAL_STORAGE_URL = 'classComponentSearchText';

interface AppState {
  searchText: string;
  results: Character[];
  isLoading: boolean;
  error: string | null;
}

export class App extends Component<object, AppState> {
  constructor(props: object) {
    super(props);
    this.state = {
      searchText: '',
      results: [],
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

  fetchCharacters = async (searchText: string) => {
    this.setState({ isLoading: true, error: null });

    try {
      const data = await searchCharacters(searchText);
      this.setState({ results: data, isLoading: false });
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

  render() {
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
      </div>
    );
  }
}
