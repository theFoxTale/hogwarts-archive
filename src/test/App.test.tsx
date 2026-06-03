import { vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';

import { ThemeProvider } from '@contexts';
import { APP_STRINGS } from '@layout';
import { useSearchCharactersQuery } from '@api';

import { App } from '../App';
import { createTestStore } from './utils/test-utils.tsx';

vi.mock('@api', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@api')>();
  return {
    ...actual,
    useSearchCharactersQuery: vi.fn(),
  };
});

describe('App', () => {
  test('renders without crashing and shows header content', () => {
    vi.mocked(useSearchCharactersQuery).mockReturnValue({
      data: { items: [], pages: null },
      isLoading: false,
      isError: false,
      error: null,
      refetch: vi.fn(),
    });

    render(
      <Provider store={createTestStore()}>
        <ThemeProvider>
          <App />
        </ThemeProvider>
      </Provider>
    );

    expect(screen.getByText(APP_STRINGS.APP_NAME)).toBeInTheDocument();
  });
});
