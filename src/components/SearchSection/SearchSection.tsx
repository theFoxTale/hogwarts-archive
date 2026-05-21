import { type ChangeEvent, type KeyboardEvent } from 'react';
import { UI_MESSAGES } from '../../constants';
import { RoundedFrame } from '../RoundedFrame/RoundedFrame';

import './SearchSection.css';
import wandIcon from '../../assets/images/wand-accio.png';

interface SearchSectionProps {
  value: string;
  onChange: (value: string) => void;
  onSearch: (searchText: string) => void;
}

export function SearchSection({
  value,
  onChange,
  onSearch,
}: SearchSectionProps) {
  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value);
  };

  const handleClear = () => {
    onChange('');
    onSearch('');
  };

  const handleSearch = () => {
    onSearch(value.trim());
  };

  const handleKeyPress = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <div className="search-section">
      <p className="search-section-title magic-subtitle">
        {UI_MESSAGES.SEARCH_HEADER}
      </p>

      <div className="search-section-container">
        <div className="search-input-wrapper">
          <RoundedFrame className="search-input-frame variant-input">
            <input
              type="text"
              placeholder={UI_MESSAGES.SEARCH_PLACEHOLDER}
              className="search-input"
              value={value}
              onChange={handleInputChange}
              onKeyDown={handleKeyPress}
            />
          </RoundedFrame>

          {value && (
            <button
              className="clear-button"
              onClick={handleClear}
              aria-label="Clear search"
              type="button"
            >
              ✖
            </button>
          )}
        </div>

        <RoundedFrame className="search-button-frame variant-gold">
          <button className="search-button" onClick={handleSearch}>
            <img src={wandIcon} alt="" />
            {UI_MESSAGES.SEARCH_BUTTON_TEXT}
          </button>
        </RoundedFrame>
      </div>
    </div>
  );
}
