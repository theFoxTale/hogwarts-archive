import { getCharacterById, searchCharacters } from '@api';
import { mockFetch } from '../mocks/fetchMock';

describe('characters API', () => {
  beforeEach(() => {
    vi.stubEnv('NEXT_PUBLIC_USE_MOCK_API', 'false');
  });

  afterEach(() => {
    vi.unstubAllEnvs();
    vi.restoreAllMocks();
  });

  test('searchCharacters maps the PotterDB list response', async () => {
    mockFetch({
      data: {
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
      },
    });

    await expect(searchCharacters('Harry', 1)).resolves.toEqual({
      items: [
        {
          id: '1',
          name: 'Harry',
          house: 'Gryffindor',
          species: 'Human',
          gender: 'Male',
          image: null,
          born: null,
          died: null,
          blood_status: null,
          nationality: null,
          patronus: null,
          wands: null,
          jobs: null,
          alias_names: undefined,
        },
      ],
      pages: {
        pagination: { current: 1, last: 5, records: 10 },
        links: { self: '' },
      },
    });
  });

  test('getCharacterById maps a single PotterDB record', async () => {
    mockFetch({
      data: {
        data: {
          id: '2',
          type: 'character',
          attributes: {
            name: 'Hermione',
            born: '1979',
            alias_names: ['The Brightest Witch'],
          },
        },
      },
    });

    await expect(getCharacterById('2')).resolves.toMatchObject({
      id: '2',
      name: 'Hermione',
      born: '1979',
      alias_names: ['The Brightest Witch'],
    });
  });

  test('searchCharacters throws when the request fails', async () => {
    mockFetch({ data: {}, status: 500 });
    await expect(searchCharacters('', 1)).rejects.toThrow(
      'Failed to fetch characters'
    );
  });
});
