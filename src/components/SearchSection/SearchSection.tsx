import { Component } from 'react';
import type { ChangeEvent, KeyboardEvent } from 'react';

import './SearchSection.css';

interface SearchSectionProps {
  onSearch: (searchText: string) => void;
  initialSearchText?: string;
}

interface SearchSectionState {
  inputValue: string;
}

export class SearchSection extends Component<
  SearchSectionProps,
  SearchSectionState
> {
  constructor(props: SearchSectionProps) {
    super(props);
    this.state = {
      inputValue: props.initialSearchText || '',
    };
  }

  componentDidUpdate(prevProps: SearchSectionProps) {
    if (prevProps.initialSearchText !== this.props.initialSearchText) {
      this.setState({ inputValue: this.props.initialSearchText || '' });
    }
  }

  handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    this.setState({ inputValue: e.target.value });
  };

  handleSearch = () => {
    const trimmedSearchText = this.state.inputValue.trim();
    this.props.onSearch(trimmedSearchText);
  };

  handleKeyPress = (e: KeyboardEvent) => {
    if (e.key === 'Enter') {
      this.handleSearch();
    }
  };

  render() {
    return (
      <div className="search-section">
        <input
          type="text"
          placeholder="Search characters..."
          className="search-input"
          value={this.state.inputValue}
          onChange={this.handleInputChange}
          onKeyDown={this.handleKeyPress}
        />
        <button className="search-button" onClick={this.handleSearch}>
          Search
        </button>
      </div>
    );
  }
}
