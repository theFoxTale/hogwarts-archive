import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { vi } from 'vitest';

import { Provider } from 'react-redux';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { configureStore } from '@reduxjs/toolkit';

import {
  mockCharacters,
  mockSearchResponse,
  mockSearchSecondResponse,
} from './mocks/api';

import { selectedItemsReducer } from '@store/slices';
import { searchCharacters } from '@api';

import { HomePage, LOCAL_STORAGE_KEYS } from '@pages';
import { ThemeProvider } from '@contexts';
import {
  ERROR_BOUNDARY_STRINGS,
  RESULTS_STRING,
  SEARCH_STRINGS,
} from '@layout';

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

const createEmptyStore = () =>
  configureStore({
    reducer: { selectedItems: selectedItemsReducer },
    preloadedState: { selectedItems: {} },
  });

const renderWithRouter = (initialEntries = ['/']) => {
  return render(
    <Provider store={createEmptyStore()}>
      <ThemeProvider>
        <MemoryRouter initialEntries={initialEntries}>
          <Routes>
            <Route path="/:page?" element={<HomePage />} />
          </Routes>
        </MemoryRouter>
      </ThemeProvider>
    </Provider>
  );
};

describe('HomePage Integration', () => {
  beforeEach(() => {
    vi.mocked(searchCharacters).mockClear();
    localStorage.clear();
  });

  test('loads initial data without saved search term in localStorage', async () => {
    vi.mocked(searchCharacters).mockResolvedValue(mockSearchResponse);

    renderWithRouter(['/']);
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

    renderWithRouter(['/']);
    await waitFor(() => {
      expect(searchCharacters).toHaveBeenCalledWith('Hermione', 1);
    });
    await waitFor(() => {
      expect(screen.getByText('Hermione Granger')).toBeInTheDocument();
    });

    const input: HTMLInputElement = screen.getByPlaceholderText(
      SEARCH_STRINGS.SEARCH_PLACEHOLDER
    );
    expect(input.value).toBe('Hermione');
  });

  test('performs search and saves term to localStorage', async () => {
    vi.mocked(searchCharacters).mockResolvedValue(mockSearchResponse);

    renderWithRouter(['/']);

    const input = screen.getByPlaceholderText(
      SEARCH_STRINGS.SEARCH_PLACEHOLDER
    );
    await userEvent.type(input, 'Harry');

    const searchBtn = screen.getByRole('button', {
      name: SEARCH_STRINGS.SEARCH_BUTTON_TEXT,
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

  test('restores search term from localStorage and page from URL on mount', async () => {
    localStorage.setItem(
      LOCAL_STORAGE_KEYS.SEARCH_TEXT,
      JSON.stringify('Hermione')
    );
    vi.mocked(searchCharacters).mockResolvedValue(mockSearchResponse);

    renderWithRouter(['/2']);

    await waitFor(() => {
      expect(searchCharacters).toHaveBeenCalledWith('Hermione', 2);
    });

    await waitFor(() => {
      expect(screen.getByText('Harry Potter')).toBeInTheDocument();
    });

    const input: HTMLInputElement = screen.getByPlaceholderText(
      SEARCH_STRINGS.SEARCH_PLACEHOLDER
    );
    expect(input.value).toBe('Hermione');
  });

  test('does not repeat search if term is same', async () => {
    vi.mocked(searchCharacters).mockResolvedValue(mockSearchResponse);

    renderWithRouter(['/']);

    await waitFor(() => {
      expect(screen.getByText('Harry Potter')).toBeInTheDocument();
    });

    const searchBtn = screen.getByRole('button', {
      name: SEARCH_STRINGS.SEARCH_BUTTON_TEXT,
    });
    await userEvent.click(searchBtn);
    expect(searchCharacters).toHaveBeenCalledTimes(1);

    await userEvent.click(searchBtn);
    expect(searchCharacters).toHaveBeenCalledTimes(1);
  });

  test('handles API error and displays error message', async () => {
    vi.mocked(searchCharacters).mockRejectedValue(new Error('Network error'));

    renderWithRouter(['/']);

    await waitFor(() => {
      expect(screen.getByText('Network error')).toBeInTheDocument();
    });
  });

  test('shows no results message when search returns empty list', async () => {
    vi.mocked(searchCharacters).mockResolvedValue({ items: [], pages: null });
    renderWithRouter(['/']);
    await waitFor(() => {
      expect(screen.getByText(RESULTS_STRING.NO_RESULTS)).toBeInTheDocument();
    });
  });

  test('pagination: next page loads and saves page', async () => {
    vi.mocked(searchCharacters)
      .mockResolvedValueOnce(mockSearchResponse)
      .mockResolvedValueOnce(mockSearchSecondResponse);

    renderWithRouter(['/']);

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
      .mockResolvedValueOnce(mockSearchResponse)
      .mockResolvedValueOnce(mockSearchSecondResponse)
      .mockResolvedValueOnce(mockSearchResponse);

    renderWithRouter(['/']);

    await waitFor(() =>
      expect(screen.getByText('Harry Potter')).toBeInTheDocument()
    );

    const nextButton = screen.getByRole('button', { name: /next/i });
    await userEvent.click(nextButton);
    await waitFor(() => expect(screen.getByText('Ron')).toBeInTheDocument());

    const prevButton = screen.getByRole('button', { name: /previous/i });
    await userEvent.click(prevButton);

    await waitFor(() => {
      expect(searchCharacters).toHaveBeenLastCalledWith('', 1);
    });

    await waitFor(() =>
      expect(screen.getByText('Harry Potter')).toBeInTheDocument()
    );
  });

  test('search resets page to 1 when performed after pagination', async () => {
    const mock = vi.mocked(searchCharacters);
    mock
      .mockResolvedValueOnce(mockSearchResponse)
      .mockResolvedValueOnce(mockSearchSecondResponse)
      .mockResolvedValue(mockSearchResponse);

    renderWithRouter(['/']);

    await waitFor(() =>
      expect(screen.getByText('Harry Potter')).toBeInTheDocument()
    );

    const nextButton = screen.getByRole('button', { name: /next/i });
    await userEvent.click(nextButton);
    await waitFor(() => expect(screen.getByText('Ron')).toBeInTheDocument());

    const input = screen.getByPlaceholderText(
      SEARCH_STRINGS.SEARCH_PLACEHOLDER
    );
    await userEvent.clear(input);
    await userEvent.type(input, 'Harry');
    const searchBtn = screen.getByRole('button', {
      name: SEARCH_STRINGS.SEARCH_BUTTON_TEXT,
    });
    await userEvent.click(searchBtn);

    await waitFor(() => {
      expect(searchCharacters).toHaveBeenLastCalledWith('Harry', 1);
    });

    await waitFor(() => {
      expect(screen.queryByText('Ron')).not.toBeInTheDocument();
    });

    await waitFor(() => {
      expect(screen.getByText('Harry Potter')).toBeInTheDocument();
    });
  });

  test('clicking error flag triggers error boundary fallback', async () => {
    vi.mocked(searchCharacters).mockResolvedValue(mockSearchResponse);

    renderWithRouter(['/']);

    await waitFor(() =>
      expect(screen.getByText('Harry Potter')).toBeInTheDocument()
    );

    const errorFlag = document.querySelector('.error-flag') as HTMLElement;
    expect(errorFlag).toBeInTheDocument();

    await userEvent.click(errorFlag);

    expect(
      await screen.findByText(ERROR_BOUNDARY_STRINGS.FALLBACK_TITLE)
    ).toBeInTheDocument();
    expect(screen.getByText(RESULTS_STRING.TEST_BUTTON)).toBeInTheDocument();
  });
});
