'use server';

import {
  API_CONFIG,
  getCharacterById,
  searchCharacters,
  type Character,
  type SearchResponse,
} from '@api';

export async function searchCharactersAction(
  name: string,
  page: number,
  size: number = API_CONFIG.ITEMS_PER_PAGE
): Promise<SearchResponse> {
  return searchCharacters(name, page, size);
}

export async function getCharacterAction(id: string): Promise<Character> {
  return getCharacterById(id);
}
