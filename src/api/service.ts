import type {
  ApiResponse,
  Character,
  CharacterData,
  PaginationInfo,
} from './types.ts';

const BASE_URL = 'https://api.potterdb.com/v1/characters';

export interface SearchResponse {
  items: Character[];
  pages: PaginationInfo | null;
}

export async function searchCharacters(
  characterName: string
): Promise<SearchResponse> {
  const trimmedName = characterName.trim();
  const url =
    trimmedName === ''
      ? BASE_URL
      : `${BASE_URL}?filter[name_cont]=${encodeURIComponent(trimmedName)}`;

  const response = await fetch(url + '&page[size]=3');

  if (!response.ok) {
    throw new Error(`PotterDB API HTTP error! status: ${response.status}`);
  }

  const json: ApiResponse = await response.json();

  if (!json.data || !Array.isArray(json.data)) {
    return {
      items: [],
      pages: null,
    };
  }

  const items: Character[] = json.data.map((item: CharacterData) => {
    const attrs = item.attributes;

    return {
      name: attrs.name || 'Unnamed',
      house: attrs.house ?? null,
      species: attrs.species ?? null,
      gender: attrs.gender ?? null,
      image: attrs.image ?? null,
    };
  });

  let pages: PaginationInfo | null = null;
  if (json.meta?.pagination) {
    pages = {
      pagination: json.meta.pagination,
      links: json.links,
    };
  }

  return { items, pages };
}
