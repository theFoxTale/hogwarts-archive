import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { vi } from 'vitest';

import { mockSearchResponse } from './mocks/api';

import { UI_MESSAGES } from '../constants';
import { searchCharacters } from '../api';
import { HomePage } from '../pages';

vi.mock('../api/service', () => ({
  searchCharacters: vi.fn(),
}));

vi.mock('../constants', async () => {
  const actual = await vi.importActual('../constants');
  return {
    ...actual,
    LOADING_DELAY: { IS_SIMULATED: true, TIME_MS: 50 },
  };
});

describe('HomePage with simulated loading delay', () => {
  beforeEach(() => {
    vi.mocked(searchCharacters).mockResolvedValue(mockSearchResponse);
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  test('shows loading indicator during simulated delay and hides after', async () => {
    render(
      <MemoryRouter>
        <HomePage />
      </MemoryRouter>
    );
    expect(screen.getByText(UI_MESSAGES.LOADING)).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByText('Harry Potter')).toBeInTheDocument();
    });

    expect(screen.queryByText(UI_MESSAGES.LOADING)).not.toBeInTheDocument();
  });
});
