import { vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';

import { mockSearchResponse } from './mocks/api';

import { selectedItemsReducer } from '@store/slices';
import { searchCharacters } from '@api';

import { HomePage } from '@pages';
import { ThemeProvider } from '@contexts';
import { RESULTS_STRING } from '@layout';

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

const createEmptyStore = () =>
  configureStore({
    reducer: { selectedItems: selectedItemsReducer },
    preloadedState: { selectedItems: {} },
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
      <Provider store={createEmptyStore()}>
        <ThemeProvider>
          <MemoryRouter>
            <HomePage />
          </MemoryRouter>
        </ThemeProvider>
      </Provider>
    );

    expect(screen.getByText(RESULTS_STRING.LOADING)).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByText('Harry Potter')).toBeInTheDocument();
    });

    expect(screen.queryByText(RESULTS_STRING.LOADING)).not.toBeInTheDocument();
  });
});
