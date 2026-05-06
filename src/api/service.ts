import type {
  ApiResponse,
  Character,
  CharacterData,
  PaginationInfo,
} from './types.ts';
import { API_CONFIG, ERROR_MESSAGES } from '../constants';

export interface SearchResponse {
  items: Character[];
  pages: PaginationInfo | null;
}

export async function searchCharacters(
  characterName: string,
  page: number = 1,
  itemsPerPage: number = API_CONFIG.ITEMS_PER_PAGE
): Promise<SearchResponse> {
  const params = new URLSearchParams();

  const trimmedName = characterName.trim();
  if (trimmedName !== '') {
    params.append('filter[name_cont]', trimmedName);
  }

  params.append('page[number]', page.toString());
  params.append('page[size]', itemsPerPage.toString());

  const url = `${API_CONFIG.BASE_URL}?${params.toString()}`;
  const response = await fetch(url);

  if (!response.ok) {
    if (response.status === 404) {
      throw new Error(ERROR_MESSAGES.NOT_FOUND);
    } else if (response.status >= 500) {
      throw new Error(
        `${ERROR_MESSAGES.SERVER}, server status ${response.status}`
      );
    } else {
      throw new Error(
        `${ERROR_MESSAGES.HTTP}, server status ${response.status}`
      );
    }
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
