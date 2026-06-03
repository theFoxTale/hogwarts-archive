import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { vi } from 'vitest';

import { Provider } from 'react-redux';
import { MemoryRouter, Routes, Route } from 'react-router-dom';

import {
  mockCharacters,
  mockSearchResponse,
  mockSearchSecondResponse,
} from './mocks/api';

import { ThemeProvider } from '@contexts';
import { useSearchCharactersQuery } from '@api';

import { HomePage, LOCAL_STORAGE_KEYS } from '@pages';
import {
  RESULTS_STRING,
  SEARCH_STRINGS,
  ERROR_BOUNDARY_STRINGS,
} from '@layout';
import { createTestStore } from './utils/test-utils.tsx';

vi.mock('@api', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@api')>();
  return {
    ...actual,
    useSearchCharactersQuery: vi.fn(),
    useGetCharacterByIdQuery: vi.fn(),
  };
});

const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

const renderWithRouter = (initialEntries = ['/']) => {
  return render(
    <Provider store={createTestStore()}>
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

describe('HomePage', () => {
  beforeEach(() => {
    vi.mocked(useSearchCharactersQuery).mockClear();
    mockNavigate.mockClear();
    localStorage.clear();
  });

  test('loads initial data without saved search term in localStorage', async () => {
    vi.mocked(useSearchCharactersQuery).mockReturnValue({
      data: mockSearchResponse,
      isLoading: false,
      isError: false,
      error: null,
      refetch: vi.fn(),
    });

    renderWithRouter(['/']);

    expect(useSearchCharactersQuery).toHaveBeenCalledWith(
      { name: '', page: 1 },
      { skip: false }
    );

    await waitFor(() => {
      expect(screen.getByText('Harry Potter')).toBeInTheDocument();
    });
  });

  test('uses saved search term from localStorage', async () => {
    localStorage.setItem(
      LOCAL_STORAGE_KEYS.SEARCH_TEXT,
      JSON.stringify('Hermione')
    );
    vi.mocked(useSearchCharactersQuery).mockReturnValue({
      data: {
        items: [
          {
            id: '2',
            name: 'Hermione Granger',
            house: 'Gryffindor',
            species: 'Human',
            gender: 'Female',
            image: null,
          },
        ],
        pages: null,
      },
      isLoading: false,
      isError: false,
      error: null,
      refetch: vi.fn(),
    });

    renderWithRouter(['/']);
    await waitFor(() => {
      expect(screen.getByText('Hermione Granger')).toBeInTheDocument();
    });

    const input: HTMLInputElement = screen.getByPlaceholderText(
      SEARCH_STRINGS.SEARCH_PLACEHOLDER
    );
    expect(input.value).toBe('Hermione');
  });

  test('performs search and saves term to localStorage', async () => {
    const mockRefetch = vi.fn();
    vi.mocked(useSearchCharactersQuery).mockReturnValue({
      data: mockSearchResponse,
      isLoading: false,
      isError: false,
      error: null,
      refetch: mockRefetch,
    });

    renderWithRouter(['/']);

    const input = screen.getByPlaceholderText(
      SEARCH_STRINGS.SEARCH_PLACEHOLDER
    );
    await userEvent.type(input, 'Harry');

    const searchBtn = screen.getByRole('button', {
      name: SEARCH_STRINGS.SEARCH_BUTTON_TEXT,
    });
    await userEvent.click(searchBtn);

    expect(useSearchCharactersQuery).toHaveBeenLastCalledWith(
      { name: 'Harry', page: 1 },
      { skip: false }
    );
    expect(localStorage.setItem).toHaveBeenCalledWith(
      LOCAL_STORAGE_KEYS.SEARCH_TEXT,
      JSON.stringify('Harry')
    );
  });

  test('restores search term from localStorage and page from URL on mount', async () => {
    localStorage.setItem(LOCAL_STORAGE_KEYS.SEARCH_TEXT, JSON.stringify('Ron'));
    vi.mocked(useSearchCharactersQuery).mockReturnValue({
      data: {
        items: mockCharacters,
        pages: {
          pagination: { current: 2, prev: 1, next: 3, last: 5, records: 15 },
          links: null,
        },
      },
      isLoading: false,
      isError: false,
      error: null,
      refetch: vi.fn(),
    });

    renderWithRouter(['/2']);
    await waitFor(() => {
      expect(useSearchCharactersQuery).toHaveBeenCalledWith(
        { name: 'Ron', page: 2 },
        { skip: false }
      );
    });
    const input = screen.getByPlaceholderText(
      SEARCH_STRINGS.SEARCH_PLACEHOLDER
    ) as HTMLInputElement;
    expect(input.value).toBe('Ron');
  });

  test('does not repeat search if term is same', async () => {
    vi.mocked(useSearchCharactersQuery).mockReturnValue({
      data: mockSearchResponse,
      isLoading: false,
      isError: false,
      error: null,
      refetch: vi.fn(),
    });

    renderWithRouter(['/']);
    const searchBtn = screen.getByRole('button', {
      name: SEARCH_STRINGS.SEARCH_BUTTON_TEXT,
    });
    await userEvent.click(searchBtn);

    expect(mockNavigate).not.toHaveBeenCalled();
  });

  test('handles API error and displays error message', async () => {
    vi.mocked(useSearchCharactersQuery).mockReturnValue({
      data: undefined,
      isLoading: false,
      isError: true,
      error: new Error('Network error'),
      refetch: vi.fn(),
    });

    renderWithRouter(['/']);
    await waitFor(() => {
      expect(screen.getByText('Network error')).toBeInTheDocument();
    });
  });

  test('shows no results message when search returns empty list', async () => {
    vi.mocked(useSearchCharactersQuery).mockReturnValue({
      data: { items: [], pages: null },
      isLoading: false,
      isError: false,
      error: null,
      refetch: vi.fn(),
    });

    renderWithRouter(['/']);
    await waitFor(() => {
      expect(screen.getByText(RESULTS_STRING.NO_RESULTS)).toBeInTheDocument();
    });
  });

  test('pagination: next page loads and saves page', async () => {
    const mockRefetch = vi.fn();
    vi.mocked(useSearchCharactersQuery).mockReturnValue({
      data: {
        items: [
          {
            id: '3',
            name: 'Ron Weasley',
            house: 'Gryffindor',
            species: 'Human',
            gender: 'Male',
            image: null,
          },
        ],
        pages: {
          pagination: { current: 2, prev: 1, next: 3, last: 3, records: 9 },
          links: null,
        },
      },
      isLoading: false,
      isError: false,
      error: null,
      refetch: mockRefetch,
    });

    renderWithRouter(['/']);

    expect(useSearchCharactersQuery).toHaveBeenCalledWith(
      { name: '', page: 1 },
      { skip: false }
    );
  });

  test('pagination: previous page loads and saves page', async () => {
    renderWithRouter(['/2']);
    vi.mocked(useSearchCharactersQuery).mockReturnValue({
      data: mockSearchSecondResponse,
      isLoading: false,
      isError: false,
      error: null,
      refetch: vi.fn(),
    });
    await screen.findByText('Ron Weasley');

    const prevButton = screen.getByRole('button', { name: /previous/i });
    await userEvent.click(prevButton);
    expect(mockNavigate).toHaveBeenCalledWith('/1');
  });

  test('search resets page to 1 when performed after pagination', async () => {
    vi.mocked(useSearchCharactersQuery).mockReturnValue({
      data: mockSearchResponse,
      isLoading: false,
      isError: false,
      error: null,
      refetch: vi.fn(),
    });

    const { unmount } = renderWithRouter(['/']);
    await waitFor(() =>
      expect(screen.getByText('Harry Potter')).toBeInTheDocument()
    );

    const nextButton = screen.getByRole('button', { name: /next/i });
    await userEvent.click(nextButton);
    expect(mockNavigate).toHaveBeenCalledWith('/2');

    unmount();

    vi.mocked(useSearchCharactersQuery).mockReturnValue({
      data: mockSearchSecondResponse,
      isLoading: false,
      isError: false,
      error: null,
      refetch: vi.fn(),
    });

    renderWithRouter(['/2']);
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

    expect(mockNavigate).toHaveBeenCalledWith('/1');
  });

  test('clicking error flag triggers error boundary fallback', async () => {
    vi.mocked(useSearchCharactersQuery).mockReturnValue({
      data: mockSearchResponse,
      isLoading: false,
      isError: false,
      error: null,
      refetch: vi.fn(),
    });

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

  test('clicking refresh button calls refetch', async () => {
    const mockRefetch = vi.fn();
    vi.mocked(useSearchCharactersQuery).mockReturnValue({
      data: mockSearchResponse,
      isLoading: false,
      isError: false,
      error: null,
      refetch: mockRefetch,
    });

    renderWithRouter(['/']);
    const refreshButton = screen.getByTitle(
      SEARCH_STRINGS.REFRESH_BUTTON_LABEL
    );
    await userEvent.click(refreshButton);
    expect(mockRefetch).toHaveBeenCalledTimes(1);
  });
});
