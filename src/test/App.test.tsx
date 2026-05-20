import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { vi } from 'vitest';

import {
  mockCharacters,
  mockSearchResponse,
  mockSearchSecondResponse,
} from './mocks/api';

import { LOCAL_STORAGE_KEYS, UI_MESSAGES } from '../constants';
import { searchCharacters } from '../api';
import { App } from '../App';

vi.mock('../api/service', () => ({
  searchCharacters: vi.fn(),
}));

// убрала задержку времени для визуального отображения спиннера чтобы тесты были быстрее
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
    await waitFor(() => {
      expect(searchCharacters).toHaveBeenCalledWith('', 1);
    });

    await waitFor(() => {
      expect(screen.getByText('Harry Potter')).toBeInTheDocument();
    });
  });

  test('uses saved search term from localStorage on mount', async () => {
    localStorage.setItem(
      LOCAL_STORAGE_KEYS.SEARCH_TEXT,
      JSON.stringify('Hermione')
    );
    vi.mocked(searchCharacters).mockResolvedValue({
      items: [mockCharacters[1]],
      pages: null,
    });

    render(<App />);

    await waitFor(() => {
      expect(searchCharacters).toHaveBeenCalledWith('Hermione', 1);
    });
    await waitFor(() => {
      expect(screen.getByText('Hermione Granger')).toBeInTheDocument();
    });

    const input: HTMLInputElement = screen.getByPlaceholderText(
      UI_MESSAGES.SEARCH_PLACEHOLDER
    );
    expect(input.value).toBe('Hermione');
  });

  test('performs search and saves term to localStorage', async () => {
    vi.mocked(searchCharacters).mockResolvedValue(mockSearchResponse);

    render(<App />);

    const input = screen.getByPlaceholderText(UI_MESSAGES.SEARCH_PLACEHOLDER);
    await userEvent.type(input, 'Harry');

    const searchBtn = screen.getByRole('button', {
      name: UI_MESSAGES.SEARCH_BUTTON_TEXT,
    });
    await userEvent.click(searchBtn);

    await waitFor(() => {
      expect(searchCharacters).toHaveBeenCalledWith('Harry', 1);
    });
    expect(localStorage.setItem).toHaveBeenCalledWith(
      LOCAL_STORAGE_KEYS.SEARCH_TEXT,
      JSON.stringify('Harry')
    );
    expect(localStorage.setItem).toHaveBeenCalledWith(
      LOCAL_STORAGE_KEYS.SEARCH_PAGE,
      '1'
    );
  });

  test('restores search term and page from localStorage on mount', async () => {
    localStorage.setItem(
      LOCAL_STORAGE_KEYS.SEARCH_TEXT,
      JSON.stringify('Hermione')
    );
    localStorage.setItem(LOCAL_STORAGE_KEYS.SEARCH_PAGE, '2');

    vi.mocked(searchCharacters).mockResolvedValue(mockSearchResponse);

    render(<App />);
    await waitFor(() => {
      expect(searchCharacters).toHaveBeenCalledWith('Hermione', 2);
    });

    await waitFor(() => {
      expect(screen.getByText('Harry Potter')).toBeInTheDocument();
    });

    const input: HTMLInputElement = screen.getByPlaceholderText(
      UI_MESSAGES.SEARCH_PLACEHOLDER
    );
    expect(input.value).toBe('Hermione');
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
    vi.mocked(searchCharacters)
      .mockResolvedValueOnce(mockSearchResponse)
      .mockResolvedValueOnce(mockSearchSecondResponse);

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

  test('pagination: previous page loads and saves page', async () => {
    vi.mocked(searchCharacters)
      .mockResolvedValueOnce(mockSearchResponse) // первая страница при монтировании
      .mockResolvedValueOnce(mockSearchSecondResponse) // переход на вторую
      .mockResolvedValueOnce(mockSearchResponse); // возврат на первую

    render(<App />);

    await waitFor(() =>
      expect(screen.getByText('Harry Potter')).toBeInTheDocument()
    );

    const nextButton = screen.getByRole('button', { name: /next/i });
    await userEvent.click(nextButton);
    await waitFor(() => expect(screen.getByText('Ron')).toBeInTheDocument());

    const prevButton = screen.getByRole('button', { name: /previous/i });
    await userEvent.click(prevButton);

    expect(searchCharacters).toHaveBeenLastCalledWith('', 1);
    expect(localStorage.setItem).toHaveBeenCalledWith(
      LOCAL_STORAGE_KEYS.SEARCH_PAGE,
      '1'
    );
    await waitFor(() =>
      expect(screen.getByText('Harry Potter')).toBeInTheDocument()
    );
  });

  test('search resets page to 1 when performed after pagination', async () => {
    vi.mocked(searchCharacters)
      .mockResolvedValueOnce(mockSearchResponse)
      .mockResolvedValueOnce(mockSearchSecondResponse)
      .mockResolvedValueOnce(mockSearchResponse); // поиск после пагинации

    render(<App />);

    await waitFor(() =>
      expect(screen.getByText('Harry Potter')).toBeInTheDocument()
    );

    const nextButton = screen.getByRole('button', { name: /next/i });
    await userEvent.click(nextButton);
    await waitFor(() => expect(screen.getByText('Ron')).toBeInTheDocument());

    const input = screen.getByPlaceholderText(UI_MESSAGES.SEARCH_PLACEHOLDER);
    await userEvent.type(input, 'Harry');
    const searchBtn = screen.getByRole('button', {
      name: UI_MESSAGES.SEARCH_BUTTON_TEXT,
    });
    await userEvent.click(searchBtn);

    expect(searchCharacters).toHaveBeenLastCalledWith('Harry', 1);
    expect(localStorage.setItem).toHaveBeenCalledWith(
      LOCAL_STORAGE_KEYS.SEARCH_PAGE,
      '1'
    );
    await waitFor(() =>
      expect(screen.getByText('Harry Potter')).toBeInTheDocument()
    );
  });

  test('clicking floating error button triggers error boundary fallback', async () => {
    vi.mocked(searchCharacters).mockResolvedValue(mockSearchResponse);
    render(<App />);
    await waitFor(() =>
      expect(screen.getByText('Harry Potter')).toBeInTheDocument()
    );

    const errorButton = screen.getByLabelText(/simulate error/i);
    await userEvent.click(errorButton);

    expect(screen.getByText(UI_MESSAGES.FALLBACK_TITLE)).toBeInTheDocument();
    expect(screen.getByText(UI_MESSAGES.TRY_AGAIN)).toBeInTheDocument();

    const tryAgainButton = screen.getByRole('button', {
      name: UI_MESSAGES.TRY_AGAIN,
    });
    await userEvent.click(tryAgainButton);

    await waitFor(() => {
      expect(screen.getByText('Harry Potter')).toBeInTheDocument();
    });
  });
});
