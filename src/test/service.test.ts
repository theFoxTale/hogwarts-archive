import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { emptySearchResult } from './mocks/api';

// Принудительное отключение mock-режима для тестов
vi.mock('../api/index.ts', async () => {
  const actual =
    await vi.importActual<typeof import('../api/index.ts')>('../api/index.ts');
  return {
    ...actual,
    API_CONFIG: {
      BASE_URL: actual.API_CONFIG.BASE_URL,
      ITEMS_PER_PAGE: actual.API_CONFIG.ITEMS_PER_PAGE,
      USE_MOCK_API: false,
      USE_MOCK_DELAY: false,
    },
  };
});

import { API_CONFIG, API_ERROR_MESSAGES, searchCharacters } from '@api';

describe('searchCharacters', () => {
  const mockFetch = vi.fn();
  const originalFetch = globalThis.fetch;

  beforeEach(() => {
    globalThis.fetch = mockFetch;
  });

  afterEach(() => {
    globalThis.fetch = originalFetch;
    vi.resetAllMocks();
  });

  it('calls API with correct URL when search term is provided', async () => {
    mockFetch.mockResolvedValue(emptySearchResult);

    await searchCharacters('Harry', 2, 5);
    expect(mockFetch).toHaveBeenCalledTimes(1);

    const url = mockFetch.mock.calls[0][0];
    expect(url).toContain(API_CONFIG.BASE_URL);
    expect(url).toContain('filter%5Bname_cont%5D=Harry');
    expect(url).toContain('page%5Bnumber%5D=2');
    expect(url).toContain('page%5Bsize%5D=5');
  });

  it('calls API with correct URL when search term is empty', async () => {
    mockFetch.mockResolvedValue(emptySearchResult);

    await searchCharacters('', 1, API_CONFIG.ITEMS_PER_PAGE);

    const url = mockFetch.mock.calls[0][0];
    expect(url).not.toContain('filter%5Bname_cont%5D');
    expect(url).toContain('page%5Bnumber%5D=1');
    expect(url).toContain(`page%5Bsize%5D=${API_CONFIG.ITEMS_PER_PAGE}`);
  });

  it('returns parsed items and pagination info on success', async () => {
    const mockApiResponse = {
      data: [
        {
          id: 'harry-1',
          type: 'character',
          attributes: {
            name: 'Harry Potter',
            house: 'Gryffindor',
            species: 'Human',
            gender: 'Male',
            image: 'https://example.com/harry.jpg',
          },
        },
      ],
      meta: {
        pagination: {
          current: 1,
          next: 2,
          last: 5,
          records: 50,
        },
      },
      links: {
        self: 'https://api.potterdb.com/v1/characters?page[number]=1',
        next: 'https://api.potterdb.com/v1/characters?page[number]=2',
      },
    };

    mockFetch.mockResolvedValue({
      ok: true,
      json: async () => mockApiResponse,
    });

    const result = await searchCharacters('Harry');

    expect(result.items).toHaveLength(1);
    expect(result.items[0]).toEqual({
      id: 'harry-1',
      name: 'Harry Potter',
      house: 'Gryffindor',
      species: 'Human',
      gender: 'Male',
      image: 'https://example.com/harry.jpg',
    });
    expect(result.pages).toEqual({
      pagination: mockApiResponse.meta.pagination,
      links: mockApiResponse.links,
    });
  });

  it('returns empty items and null pages when response has no data', async () => {
    mockFetch.mockResolvedValue({
      ok: true,
      json: async () => ({ data: null }),
    });

    const result = await searchCharacters('Harry');
    expect(result.items).toEqual([]);
    expect(result.pages).toBeNull();
  });

  it('throws NOT_FOUND error on 404 status', async () => {
    mockFetch.mockResolvedValue({
      ok: false,
      status: 404,
    });

    await expect(searchCharacters('Voldemort')).rejects.toThrow(
      API_ERROR_MESSAGES.NOT_FOUND
    );
  });

  it('throws SERVER error on 500+ status', async () => {
    mockFetch.mockResolvedValue({
      ok: false,
      status: 500,
    });

    await expect(searchCharacters('Harry')).rejects.toThrow(
      new RegExp(API_ERROR_MESSAGES.SERVER)
    );
  });

  it('throws HTTP error on other 4xx status', async () => {
    mockFetch.mockResolvedValue({
      ok: false,
      status: 429,
    });

    await expect(searchCharacters('Harry')).rejects.toThrow(
      new RegExp(API_ERROR_MESSAGES.HTTP)
    );
  });
});
