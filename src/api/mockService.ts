import type { Character, PaginationInfo, SearchResponse } from './types';
import { mockCharacters } from './mockData';
import { API_CONFIG, ERROR_MESSAGES } from '@constants';

function filterByName(characters: Character[], nameQuery: string): Character[] {
  const trimmed = nameQuery.trim();
  if (!trimmed) return characters;

  const lowerQuery = trimmed.toLowerCase();

  return characters.filter((char) =>
    char.name.toLowerCase().includes(lowerQuery)
  );
}

function paginateItems<T>(items: T[], page: number, itemsPerPage: number): T[] {
  const start = (page - 1) * itemsPerPage;
  return items.slice(start, start + itemsPerPage);
}

function buildPaginationInfo(
  total: number,
  page: number,
  itemsPerPage: number
): PaginationInfo | null {
  const last = Math.ceil(total / itemsPerPage);
  if (last <= 1) return null;

  const current = page;
  const prev = current > 1 ? current - 1 : undefined;
  const next = current < last ? current + 1 : undefined;

  return {
    pagination: {
      current,
      prev,
      next,
      last,
      records: total,
    },
    links: {
      self: '',
      first: '',
      prev: prev ? '' : undefined,
      next: next ? '' : undefined,
      last: '',
    },
  };
}

export async function searchCharacters(
  characterName: string,
  page: number = 1,
  itemsPerPage: number = API_CONFIG.ITEMS_PER_PAGE
): Promise<SearchResponse> {
  if (API_CONFIG.USE_MOCK_API && API_CONFIG.MOCK_DELAY_MS > 0) {
    await new Promise((resolve) =>
      setTimeout(resolve, API_CONFIG.MOCK_DELAY_MS)
    );
  }

  const filtered = filterByName(mockCharacters, characterName);
  const total = filtered.length;

  if (total === 0) {
    return { items: [], pages: null };
  }

  const pagedItems = paginateItems(filtered, page, itemsPerPage);
  const pages = buildPaginationInfo(total, page, itemsPerPage);

  return { items: pagedItems, pages };
}

export async function getCharacterById(id: string): Promise<Character> {
  if (API_CONFIG.USE_MOCK_API && API_CONFIG.MOCK_DELAY_MS > 0) {
    await new Promise((resolve) =>
      setTimeout(resolve, API_CONFIG.MOCK_DELAY_MS)
    );
  }

  const character = mockCharacters.find((c) => c.id === id);
  if (!character) {
    throw new Error(ERROR_MESSAGES.NOT_FOUND);
  }
  return character;
}
