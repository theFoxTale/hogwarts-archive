import { configureStore } from '@reduxjs/toolkit';

import { charactersApi } from '@api';
import { mockFetch } from '../mocks/fetchMock';

describe('charactersApi', () => {
  beforeEach(() => {
    vi.stubEnv('VITE_USE_MOCK_API', 'false');
    vi.stubEnv('VITE_MOCK_DELAY_MS', '0');
  });

  afterEach(() => {
    vi.unstubAllEnvs();
    vi.restoreAllMocks();
  });

  function createStore() {
    return configureStore({
      reducer: { [charactersApi.reducerPath]: charactersApi.reducer },
      middleware: (getDefault) => getDefault().concat(charactersApi.middleware),
    });
  }

  test('searchCharacters transforms response correctly', async () => {
    const mockApiResponse = {
      data: [
        {
          id: '1',
          type: 'character',
          attributes: {
            name: 'Harry',
            house: 'Gryffindor',
            species: 'Human',
            gender: 'Male',
            image: null,
          },
        },
      ],
      meta: { pagination: { current: 1, last: 5, records: 10 } },
      links: { self: '' },
    };
    mockFetch({ data: mockApiResponse });

    const store = createStore();
    const result = await store.dispatch(
      charactersApi.endpoints.searchCharacters.initiate({
        name: 'Harry',
        page: 1,
      })
    );

    expect(result.data).toEqual({
      items: [
        {
          id: '1',
          name: 'Harry',
          house: 'Gryffindor',
          species: 'Human',
          gender: 'Male',
          image: null,
        },
      ],
      pages: {
        pagination: { current: 1, last: 5, records: 10 },
        links: { self: '' },
      },
    });
  });

  test('getCharacterById transforms response correctly', async () => {
    const mockResponse = {
      data: {
        id: '2',
        type: 'character',
        attributes: {
          name: 'Hermione',
          born: '1979',
          alias_names: ['The Brightest Witch'],
        },
      },
    };
    mockFetch({ data: mockResponse });

    const store = createStore();
    const result = await store.dispatch(
      charactersApi.endpoints.getCharacterById.initiate('2')
    );

    expect(result.data).toMatchObject({
      id: '2',
      name: 'Hermione',
      born: '1979',
      alias_names: ['The Brightest Witch'],
    });
  });
});
