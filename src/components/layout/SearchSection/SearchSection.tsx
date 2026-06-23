import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { type ChangeEvent, type KeyboardEvent } from 'react';

import { RoundedFrame } from '@ui';
import { useTheme } from '@contexts';

import './SearchSection.css';
const wandIcon = '/images/wand-accio.png';
const refreshIcon = '/images/refresh.png';

interface SearchSectionProps {
  value: string;
  onChange: (value: string) => void;
  onSearch: (searchText: string) => void;
  onRefresh: () => void;
}

export function SearchSection({
  value,
  onChange,
  onSearch,
  onRefresh,
}: SearchSectionProps) {
  const lang = useTranslations('search');

  const { theme } = useTheme();
  const searchButtonStyle = theme === 'light' ? 'variant-gold' : 'variant-dark';
  const refreshButtonStyle =
    theme === 'light' ? 'variant-dark' : 'variant-gold';

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
      <p className="magic-subtitle">{lang('header')}</p>

      <div className="search-section-container">
        <div className="search-input-wrapper">
          <RoundedFrame className="search-input-frame variant-input">
            <input
              type="text"
              placeholder={lang('placeholder')}
              className="search-input"
              value={value}
              onChange={handleInputChange}
              onKeyDown={handleKeyPress}
              aria-label={lang('description')}
            />
          </RoundedFrame>

          {value && (
            <button
              className="clear-button"
              onClick={handleClear}
              aria-label={lang('clear')}
              title={lang('clear')}
              type="button"
            >
              ✖
            </button>
          )}
        </div>

        <RoundedFrame className={`search-button-frame ${searchButtonStyle}`}>
          <button className="search-button" onClick={handleSearch}>
            <Image
              src={wandIcon}
              alt={lang('refresh')}
              aria-hidden="true"
              width={20}
              height={20}
            />
            {lang('button')}
          </button>
        </RoundedFrame>

        <RoundedFrame className={`search-button-frame ${refreshButtonStyle}`}>
          <button
            title={lang('refresh')}
            className="refresh-button search-button"
            onClick={onRefresh}
          >
            <Image
              src={refreshIcon}
              alt={lang('refreshAlt')}
              width={20}
              height={20}
            />
          </button>
        </RoundedFrame>
      </div>
    </div>
  );
}
