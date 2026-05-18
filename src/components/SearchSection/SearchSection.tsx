import { Component } from 'react';
import type { ChangeEvent, KeyboardEvent } from 'react';
import { UI_MESSAGES } from '../../constants';

import { RoundedFrame } from '../RoundedFrame/RoundedFrame';

import './SearchSection.css';
import wandIcon from '../../assets/images/wand-accio.png';

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

  handleClear = () => {
    this.setState({ inputValue: '' });
    this.props.onSearch('');
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
    const { inputValue } = this.state;

    return (
      <div className="search-section">
        <div className="search-input-wrapper">
          <RoundedFrame className="highlighted-frame">
            <input
              type="text"
              placeholder={UI_MESSAGES.SEARCH_PLACEHOLDER}
              className="search-input"
              value={inputValue}
              onChange={this.handleInputChange}
              onKeyDown={this.handleKeyPress}
            />
          </RoundedFrame>
          {inputValue && (
            <button
              className="clear-button"
              onClick={this.handleClear}
              aria-label="Clear search"
              type="button"
            >
              ✖
            </button>
          )}
        </div>
        <RoundedFrame className="search-button-frame highlighted-frame">
          <button className="search-button" onClick={this.handleSearch}>
            <img src={wandIcon} alt="" />
            {UI_MESSAGES.SEARCH_BUTTON_TEXT}
          </button>
        </RoundedFrame>
      </div>
    );
  }
}
