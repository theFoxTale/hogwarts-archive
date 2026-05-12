import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { vi } from 'vitest';

import { mockCharacters, mockSearchResponse } from './mocks/api';

import { LOCAL_STORAGE_KEYS, UI_MESSAGES } from '../constants';
import { searchCharacters } from '../api';
import { App } from '../App';

vi.mock('../api/service', () => ({
  searchCharacters: vi.fn(),
}));

// отключила задержку времени для визуального отображения спиннера чтобы тесты были быстрее
vi.mock('../constants', async () => {
  const actual = await vi.importActual('../constants');
  return {
    ...actual,
    LOADING_DELAY: { IS_SIMULATED: false, TIME_MS: 0 },
  };
});

describe('App Integration tests', () => {
  beforeEach(() => {
    vi.mocked(searchCharacters).mockClear();
    localStorage.clear();
  });

  test('loads initial data without saved search term in localStorage', async () => {
    vi.mocked(searchCharacters).mockResolvedValue(mockSearchResponse);

    render(<App />);
    expect(searchCharacters).toHaveBeenCalledWith('', 1);

    await waitFor(() => {
      expect(screen.getByText('Harry Potter')).toBeInTheDocument();
    });
  });

  test('uses saved search term from localStorage on mount', async () => {
    localStorage.setItem(LOCAL_STORAGE_KEYS.SEARCH_TEXT, 'Hermione');
    vi.mocked(searchCharacters).mockResolvedValue({
      items: [mockCharacters[1]],
      pages: null,
    });

    render(<App />);

    expect(searchCharacters).toHaveBeenCalledWith('Hermione', 1);
    await waitFor(() => {
      expect(screen.getByText('Hermione Granger')).toBeInTheDocument();
    });

    const input: HTMLInputElement =
      screen.getByPlaceholderText(/search characters/i);
    expect(input.value).toBe('Hermione');
  });

  test('performs search and saves term to localStorage', async () => {
    vi.mocked(searchCharacters).mockResolvedValue(mockSearchResponse);

    render(<App />);

    const input = screen.getByPlaceholderText(/search characters/i);
    await userEvent.type(input, 'Harry');

    const searchBtn = screen.getByRole('button', {
      name: UI_MESSAGES.SEARCH_BUTTON_TEXT,
    });
    await userEvent.click(searchBtn);

    expect(searchCharacters).toHaveBeenCalledWith('Harry', 1);
    expect(localStorage.setItem).toHaveBeenCalledWith(
      LOCAL_STORAGE_KEYS.SEARCH_TEXT,
      'Harry'
    );
    expect(localStorage.setItem).toHaveBeenCalledWith(
      LOCAL_STORAGE_KEYS.SEARCH_PAGE,
      '1'
    );
  });

  test('does not repeat search if term is same', async () => {
    vi.mocked(searchCharacters).mockResolvedValue(mockSearchResponse);

    render(<App />);

    const searchBtn = screen.getByRole('button', {
      name: UI_MESSAGES.SEARCH_BUTTON_TEXT,
    });
    await userEvent.click(searchBtn);
    expect(searchCharacters).toHaveBeenCalledTimes(1);

    await userEvent.click(searchBtn);
    expect(searchCharacters).toHaveBeenCalledTimes(1);
  });

  test('handles API error and displays error message', async () => {
    vi.mocked(searchCharacters).mockRejectedValue(new Error('Network error'));

    render(<App />);

    await waitFor(() => {
      expect(screen.getByText('Network error')).toBeInTheDocument();
    });
  });

  test('pagination: next page loads and saves page', async () => {
    const firstPageResponse = mockSearchResponse;

    const secondPageResponse = {
      items: [
        { name: 'Ron', house: null, species: null, gender: null, image: null },
      ],
      pages: {
        pagination: { current: 2, next: 3, records: 10 },
      },
    };

    vi.mocked(searchCharacters)
      .mockResolvedValueOnce(firstPageResponse)
      .mockResolvedValueOnce(secondPageResponse);

    render(<App />);

    await waitFor(() =>
      expect(screen.getByText('Harry Potter')).toBeInTheDocument()
    );

    const nextButton = screen.getByRole('button', { name: /next/i });
    await userEvent.click(nextButton);

    expect(searchCharacters).toHaveBeenLastCalledWith('', 2);
    expect(localStorage.setItem).toHaveBeenCalledWith(
      LOCAL_STORAGE_KEYS.SEARCH_PAGE,
      '2'
    );

    await waitFor(() => expect(screen.getByText('Ron')).toBeInTheDocument());
  });
});
