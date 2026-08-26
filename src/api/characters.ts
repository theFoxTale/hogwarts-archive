import { API_CONFIG } from './constants';
import { mapCharacter, mapSearchResponse } from './mappers';
import { mockGetCharacterById, mockSearchCharacters } from './mockService';
import type { Character, CharacterData, SearchResponse } from './types';

export async function searchCharacters(
  name: string,
  page: number,
  size: number = API_CONFIG.ITEMS_PER_PAGE
): Promise<SearchResponse> {
  if (API_CONFIG.USE_MOCK_API) {
    return mockSearchCharacters(name, page, size);
  }

  const params = new URLSearchParams();

  if (name.trim()) {
    params.append('filter[name_cont]', name.trim());
  }

  params.append('page[number]', String(page));
  params.append('page[size]', String(size));

  const res = await fetch(`${API_CONFIG.BASE_URL}?${params.toString()}`);
  if (!res.ok) {
    throw new Error('Failed to fetch characters');
  }

  return mapSearchResponse(await res.json());
}

export async function getCharacterById(id: string): Promise<Character> {
  if (API_CONFIG.USE_MOCK_API) {
    return mockGetCharacterById(id);
  }

  const res = await fetch(`${API_CONFIG.BASE_URL}/${id}`);
  if (!res.ok) {
    throw new Error('Failed to fetch character');
  }

  const json: { data: CharacterData } = await res.json();
  return mapCharacter(json.data);
}
