import { searchCharacters, getCharacterById } from '../api/realService';
import { ERROR_MESSAGES } from '@constants';

const mockFetch = vi.fn();
globalThis.fetch = mockFetch;

describe('realService', () => {
  beforeEach(() => {
    mockFetch.mockReset();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  // ------------------------------
  // searchCharacters
  // ------------------------------

  describe('searchCharacters', () => {
    test('builds URL with name filter when search term provided', async () => {
      mockFetch.mockResolvedValue({
        ok: true,
        json: async () => ({ data: [], meta: {} }),
      });

      await searchCharacters('Harry');

      const url = mockFetch.mock.calls[0][0];
      expect(url).toContain('filter%5Bname_cont%5D=Harry');
      expect(url).toContain('page%5Bnumber%5D=1');
      expect(url).toContain('page%5Bsize%5D=3');
    });

    test('does not add name filter when search term is empty', async () => {
      mockFetch.mockResolvedValue({
        ok: true,
        json: async () => ({ data: [], meta: {} }),
      });

      await searchCharacters('');

      const url = mockFetch.mock.calls[0][0];
      expect(url).not.toContain('filter%5Bname_cont%5D');
      expect(url).toContain('page%5Bnumber%5D=1');
    });

    test('returns parsed items and pagination from API response', async () => {
      const mockResponse = {
        data: [
          {
            id: '1',
            type: 'character',
            attributes: {
              name: 'Harry Potter',
              house: 'Gryffindor',
              species: 'Human',
              gender: 'Male',
              image: 'https://example.com/harry.jpg',
              // дополнительные поля не нужны, searchCharacters возвращает только базовые
            },
          },
        ],
        meta: {
          pagination: {
            current: 1,
            prev: null,
            next: null,
            last: 1,
            records: 1,
          },
        },
        links: { self: '', next: '' },
      };

      mockFetch.mockResolvedValue({
        ok: true,
        json: async () => mockResponse,
      });

      const result = await searchCharacters('Harry');

      expect(result.items).toHaveLength(1);
      expect(result.items[0]).toEqual({
        id: '1',
        name: 'Harry Potter',
        house: 'Gryffindor',
        species: 'Human',
        gender: 'Male',
        image: 'https://example.com/harry.jpg',
      });
      expect(result.pages).toEqual({
        pagination: mockResponse.meta.pagination,
        links: mockResponse.links,
      });
    });

    test('handles response with no data (null)', async () => {
      mockFetch.mockResolvedValue({
        ok: true,
        json: async () => ({ data: null, meta: {} }),
      });

      const result = await searchCharacters('Harry');
      expect(result.items).toEqual([]);
      expect(result.pages).toBeNull();
    });

    test('handles response with empty data array', async () => {
      mockFetch.mockResolvedValue({
        ok: true,
        json: async () => ({ data: [], meta: {} }),
      });

      const result = await searchCharacters('Harry');
      expect(result.items).toEqual([]);
      expect(result.pages).toBeNull();
    });

    test('handles response with missing pagination', async () => {
      mockFetch.mockResolvedValue({
        ok: true,
        json: async () => ({ data: [], meta: {} }),
      });

      const result = await searchCharacters('Harry');
      expect(result.items).toEqual([]);
      expect(result.pages).toBeNull();
    });

    test('throws NOT_FOUND error on 404 status', async () => {
      mockFetch.mockResolvedValue({ ok: false, status: 404 });

      await expect(searchCharacters('Harry')).rejects.toThrow(
        ERROR_MESSAGES.NOT_FOUND
      );
    });

    test('throws SERVER error on 500+ status', async () => {
      mockFetch.mockResolvedValue({ ok: false, status: 500 });

      await expect(searchCharacters('Harry')).rejects.toThrow(
        new RegExp(ERROR_MESSAGES.SERVER)
      );
    });

    test('throws HTTP error on other 4xx status', async () => {
      mockFetch.mockResolvedValue({ ok: false, status: 429 });

      await expect(searchCharacters('Harry')).rejects.toThrow(
        new RegExp(ERROR_MESSAGES.HTTP)
      );
    });

    test('throws generic error when response is not ok and status not handled', async () => {
      mockFetch.mockResolvedValue({ ok: false, status: 418 });

      await expect(searchCharacters('Harry')).rejects.toThrow(
        new RegExp(ERROR_MESSAGES.HTTP)
      );
    });
  });

  // ------------------------------
  // getCharacterById
  // ------------------------------

  describe('getCharacterById', () => {
    test('returns full character details for valid id', async () => {
      const mockResponse = {
        data: {
          id: '1',
          attributes: {
            name: 'Harry Potter',
            house: 'Gryffindor',
            species: 'Human',
            gender: 'Male',
            image: 'https://example.com/harry.jpg',
            born: '31 July 1980',
            died: null,
            blood_status: 'Half-blood',
            nationality: 'British',
            patronus: 'Stag',
            wands: ['Holly, 11", Phoenix feather'],
            jobs: ['Head of Auror Office'],
            alias_names: ['The Boy Who Lived'],
          },
        },
      };

      mockFetch.mockResolvedValue({
        ok: true,
        json: async () => mockResponse,
      });

      const result = await getCharacterById('1');
      expect(result.id).toBe('1');
      expect(result.name).toBe('Harry Potter');
      expect(result.house).toBe('Gryffindor');
      expect(result.species).toBe('Human');
      expect(result.gender).toBe('Male');
      expect(result.image).toBe('https://example.com/harry.jpg');
      expect(result.born).toBe('31 July 1980');
      expect(result.died).toBeNull();
      expect(result.blood_status).toBe('Half-blood');
      expect(result.nationality).toBe('British');
      expect(result.patronus).toBe('Stag');
      expect(result.wands).toEqual(['Holly, 11", Phoenix feather']);
      expect(result.jobs).toEqual(['Head of Auror Office']);
      expect(result.alias_names).toEqual(['The Boy Who Lived']);
    });

    test('handles missing optional fields', async () => {
      const mockApiResponse = {
        data: {
          id: '2',
          attributes: {
            name: 'Dobby',
            house: null,
            species: 'Elf',
            gender: null,
            image: null,
          },
        },
      };
      mockFetch.mockResolvedValue({
        ok: true,
        json: async () => mockApiResponse,
      });

      const result = await getCharacterById('2');
      expect(result.name).toBe('Dobby');
      expect(result.house).toBeNull();
      expect(result.species).toBe('Elf');
      expect(result.gender).toBeNull();
      expect(result.image).toBeNull();
      expect(result.born).toBeNull();
      expect(result.died).toBeNull();
      expect(result.blood_status).toBeNull();
      expect(result.nationality).toBeNull();
      expect(result.patronus).toBeNull();
      expect(result.wands).toBeNull();
      expect(result.jobs).toBeNull();
      expect(result.alias_names).toBeUndefined();
    });

    test('throws NOT_FOUND error on 404', async () => {
      mockFetch.mockResolvedValue({ ok: false, status: 404 });

      await expect(getCharacterById('999')).rejects.toThrow(
        ERROR_MESSAGES.NOT_FOUND
      );
    });

    test('throws HTTP error on other status', async () => {
      mockFetch.mockResolvedValue({ ok: false, status: 500 });

      await expect(getCharacterById('1')).rejects.toThrow(ERROR_MESSAGES.HTTP);
    });
  });
});
