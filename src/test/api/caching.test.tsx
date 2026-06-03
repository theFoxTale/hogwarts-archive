import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';

import { charactersApi, useSearchCharactersQuery } from '@api';
import { mockFetch } from '../mocks/fetchMock';

const TestComponent = ({ name, page }: { name: string; page: number }) => {
  const { data, isLoading } = useSearchCharactersQuery({ name, page });
  if (isLoading) return <div>Loading...</div>;
  return <div>{data?.items[0]?.name ?? 'No data'}</div>;
};

describe('RTK Query caching', () => {
  let store: ReturnType<typeof configureStore>;

  beforeEach(() => {
    store = configureStore({
      reducer: { [charactersApi.reducerPath]: charactersApi.reducer },
      middleware: (getDefault) => getDefault().concat(charactersApi.middleware),
    });

    vi.stubEnv('VITE_USE_MOCK_API', 'false');
    vi.stubEnv('VITE_MOCK_DELAY_MS', '0');
  });

  afterEach(() => {
    vi.unstubAllEnvs();
    vi.restoreAllMocks();
  });

  test('caches data and does not refetch when component remounts with same args', async () => {
    const mockApiResponse = {
      data: [
        {
          id: '1',
          type: 'character',
          attributes: {
            name: 'Harry',
            house: null,
            species: null,
            gender: null,
            image: null,
          },
        },
      ],
      meta: { pagination: { current: 1, last: 1, records: 1 } },
      links: {},
    };
    mockFetch({ data: mockApiResponse });

    const { unmount } = render(
      <Provider store={store}>
        <TestComponent name="Harry" page={1} />
      </Provider>
    );

    await waitFor(() => expect(screen.getByText('Harry')).toBeInTheDocument());
    expect(globalThis.fetch).toHaveBeenCalledTimes(1);

    unmount();
    render(
      <Provider store={store}>
        <TestComponent name="Harry" page={1} />
      </Provider>
    );

    await waitFor(() => expect(screen.getByText('Harry')).toBeInTheDocument());

    expect(globalThis.fetch).toHaveBeenCalledTimes(1);
  });

  test('manual refetch invalidates cache and triggers new request', async () => {
    mockFetch({
      data: {
        data: [
          {
            id: '1',
            type: 'character',
            attributes: {
              name: 'Harry',
              house: null,
              species: null,
              gender: null,
              image: null,
            },
          },
        ],
        meta: { pagination: { current: 1, last: 1, records: 1 } },
        links: {},
      },
    });

    mockFetch({
      data: {
        data: [
          {
            id: '1',
            type: 'character',
            attributes: {
              name: 'Updated Harry',
              house: null,
              species: null,
              gender: null,
              image: null,
            },
          },
        ],
        meta: { pagination: { current: 1, last: 1, records: 1 } },
        links: {},
      },
    });

    const ComponentWithRefetch = () => {
      const { data, refetch } = useSearchCharactersQuery({
        name: 'Harry',
        page: 1,
      });
      return (
        <div>
          <div>{data?.items[0]?.name}</div>
          <button onClick={refetch}>Refresh</button>
        </div>
      );
    };

    render(
      <Provider store={store}>
        <ComponentWithRefetch />
      </Provider>
    );

    await waitFor(() => expect(screen.getByText('Harry')).toBeInTheDocument());
    expect(globalThis.fetch).toHaveBeenCalledTimes(1);

    await userEvent.click(screen.getByRole('button', { name: /refresh/i }));
    await waitFor(() =>
      expect(screen.getByText('Updated Harry')).toBeInTheDocument()
    );
    expect(globalThis.fetch).toHaveBeenCalledTimes(2);
  });
});
