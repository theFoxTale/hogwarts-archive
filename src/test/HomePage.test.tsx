import type { ComponentProps } from 'react';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { vi } from 'vitest';

import { HomePage } from '@views';
import { searchCharactersAction } from '@/actions/characters';

import { renderWithProviders } from './utils/test-utils';
import { mockSearchResponse, mockSearchSecondResponse } from './mocks/api';

vi.mock('@/actions/characters', () => ({
  searchCharactersAction: vi.fn(),
  getCharacterAction: vi.fn(),
}));

const mockPush = vi.fn();
vi.mock('@/i18n/navigation', () => ({
  useRouter: () => ({ push: mockPush, replace: vi.fn() }),
  usePathname: () => '/',
}));

const searchAction = vi.mocked(searchCharactersAction);

function renderHome(overrides: Partial<ComponentProps<typeof HomePage>> = {}) {
  return renderWithProviders(
    <HomePage
      initialResults={mockSearchResponse.items}
      initialPages={mockSearchResponse.pages}
      initialPage={1}
      initialCharacterId={null}
      initialSearchQuery=""
      {...overrides}
    />
  );
}

describe('HomePage', () => {
  beforeEach(() => {
    searchAction.mockReset();
    mockPush.mockClear();
  });

  test('renders initial search results from the server', () => {
    renderHome();
    expect(screen.getByText('Harry Potter')).toBeInTheDocument();
  });

  test('shows empty archive message when there are no results', () => {
    renderHome({ initialResults: [], initialPages: null });
    expect(
      screen.getByText('No records in the magical archives. Try another name.')
    ).toBeInTheDocument();
  });

  test('does not fetch again when searching the same term', async () => {
    renderHome({ initialSearchQuery: 'Harry' });

    await userEvent.click(screen.getByRole('button', { name: /Accio/ }));

    expect(searchAction).not.toHaveBeenCalled();
    expect(mockPush).not.toHaveBeenCalled();
  });

  test('search calls the server action and updates the URL', async () => {
    searchAction.mockResolvedValue({
      items: mockSearchResponse.items,
      pages: mockSearchResponse.pages,
    });

    renderHome();

    await userEvent.type(
      screen.getByPlaceholderText('Find magical records...'),
      'Harry'
    );
    await userEvent.click(screen.getByRole('button', { name: /Accio/ }));

    await waitFor(() => {
      expect(searchAction).toHaveBeenCalledWith('Harry', 1);
    });
    expect(mockPush).toHaveBeenCalledWith('/?page=1&q=Harry');
  });

  test('refresh calls the server action for the current query', async () => {
    searchAction.mockResolvedValue(mockSearchResponse);

    renderHome({ initialSearchQuery: 'Hermione' });

    await userEvent.click(screen.getByTitle('Refresh search results'));

    await waitFor(() => {
      expect(searchAction).toHaveBeenCalledWith('Hermione', 1);
    });
  });

  test('pagination loads the next page via the server action', async () => {
    searchAction.mockResolvedValue(mockSearchSecondResponse);

    renderHome();

    await userEvent.click(screen.getByRole('button', { name: /next/i }));

    await waitFor(() => {
      expect(searchAction).toHaveBeenCalledWith('', 2);
    });
    expect(mockPush).toHaveBeenCalledWith('/?page=2');
  });

  test('shows an error when the server action fails', async () => {
    searchAction.mockRejectedValue(new Error('Network error'));

    renderHome();

    await userEvent.click(screen.getByTitle('Refresh search results'));

    expect(await screen.findByText('Network error')).toBeInTheDocument();
  });
});
