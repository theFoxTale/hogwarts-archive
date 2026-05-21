import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { vi } from 'vitest';

import {
  mockCharacters,
  mockSearchResponse,
  mockSearchSecondResponse,
} from './mocks/api';

import { LOCAL_STORAGE_KEYS, UI_MESSAGES } from '../constants';
import { searchCharacters } from '../api';
import { HomePage } from '../pages';

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

const renderWithRouter = (ui: React.ReactElement, initialEntries = ['/']) => {
  return render(
    <MemoryRouter initialEntries={initialEntries}>{ui}</MemoryRouter>
  );
};

describe('HomePage Integration tests', () => {
  beforeEach(() => {
    vi.mocked(searchCharacters).mockClear();
    localStorage.clear();
  });

  test('loads initial data without saved search term in localStorage', async () => {
    vi.mocked(searchCharacters).mockResolvedValue(mockSearchResponse);

    renderWithRouter(<HomePage />);
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

    renderWithRouter(<HomePage />);

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

    renderWithRouter(<HomePage />);

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
  });

  test('restores search term and page from localStorage on mount', async () => {
    localStorage.setItem(
      LOCAL_STORAGE_KEYS.SEARCH_TEXT,
      JSON.stringify('Hermione')
    );
    localStorage.setItem(LOCAL_STORAGE_KEYS.SEARCH_PAGE, '2');

    vi.mocked(searchCharacters).mockResolvedValue(mockSearchResponse);

    renderWithRouter(<HomePage />, ['/?page=2']);

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

    renderWithRouter(<HomePage />);

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

    renderWithRouter(<HomePage />);

    await waitFor(() => {
      expect(screen.getByText('Network error')).toBeInTheDocument();
    });
  });

  test('pagination: next page loads and saves page', async () => {
    vi.mocked(searchCharacters)
      .mockResolvedValueOnce(mockSearchResponse)
      .mockResolvedValueOnce(mockSearchSecondResponse);

    renderWithRouter(<HomePage />);

    await waitFor(() =>
      expect(screen.getByText('Harry Potter')).toBeInTheDocument()
    );

    const nextButton = screen.getByRole('button', { name: /next/i });
    await userEvent.click(nextButton);

    await waitFor(() => {
      expect(searchCharacters).toHaveBeenLastCalledWith('', 2);
    });

    await waitFor(() => expect(screen.getByText('Ron')).toBeInTheDocument());
  });

  test('pagination: previous page loads and saves page', async () => {
    vi.mocked(searchCharacters)
      .mockResolvedValueOnce(mockSearchResponse) // первая страница при монтировании
      .mockResolvedValueOnce(mockSearchSecondResponse) // переход на вторую
      .mockResolvedValueOnce(mockSearchResponse); // возврат на первую

    renderWithRouter(<HomePage />);

    await waitFor(() =>
      expect(screen.getByText('Harry Potter')).toBeInTheDocument()
    );

    const nextButton = screen.getByRole('button', { name: /next/i });
    await userEvent.click(nextButton);
    await waitFor(() => expect(screen.getByText('Ron')).toBeInTheDocument());

    const prevButton = screen.getByRole('button', { name: /previous/i });
    await userEvent.click(prevButton);

    expect(searchCharacters).toHaveBeenLastCalledWith('', 1);
    await waitFor(() =>
      expect(screen.getByText('Harry Potter')).toBeInTheDocument()
    );
  });

  test('search resets page to 1 when performed after pagination', async () => {
    const mock = vi.mocked(searchCharacters);
    mock
      .mockResolvedValueOnce(mockSearchResponse) // начальная загрузка (страница 1, поиск '')
      .mockResolvedValueOnce(mockSearchSecondResponse) // переход на вторую страницу
      .mockResolvedValueOnce(mockSearchResponse) // поиск 'Harry' на странице 1
      .mockResolvedValue(mockSearchResponse); // на случай дополнительных вызовов

    renderWithRouter(<HomePage />, ['/?page=1']);

    await waitFor(() =>
      expect(screen.getByText('Harry Potter')).toBeInTheDocument()
    );

    const nextButton = screen.getByRole('button', { name: /next/i });
    await userEvent.click(nextButton);
    await waitFor(() => expect(screen.getByText('Ron')).toBeInTheDocument());

    const input = screen.getByPlaceholderText(UI_MESSAGES.SEARCH_PLACEHOLDER);
    await userEvent.clear(input);
    await userEvent.type(input, 'Harry');
    const searchBtn = screen.getByRole('button', {
      name: UI_MESSAGES.SEARCH_BUTTON_TEXT,
    });
    await userEvent.click(searchBtn);

    await waitFor(() => {
      expect(searchCharacters).toHaveBeenLastCalledWith('Harry', 1);
    });

    await waitFor(() =>
      expect(screen.getByText('Harry Potter')).toBeInTheDocument()
    );
  });

  test('clicking floating error button triggers error boundary fallback', async () => {
    vi.mocked(searchCharacters).mockResolvedValue(mockSearchResponse);

    renderWithRouter(<HomePage />);

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
