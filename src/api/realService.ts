import type {
  ApiResponse,
  Character,
  CharacterData,
  PaginationInfo,
  SearchResponse,
} from './types.ts';
import { API_CONFIG, API_ERROR_MESSAGES } from './constants';

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
      throw new Error(API_ERROR_MESSAGES.NOT_FOUND);
    } else if (response.status >= 500) {
      throw new Error(
        `${API_ERROR_MESSAGES.SERVER}, server status ${response.status}`
      );
    } else {
      throw new Error(
        `${API_ERROR_MESSAGES.HTTP}, server status ${response.status}`
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
      id: item.id,
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

export async function getCharacterById(id: string): Promise<Character> {
  const url = `${API_CONFIG.BASE_URL}/${id}`;

  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(
      response.status === 404
        ? API_ERROR_MESSAGES.NOT_FOUND
        : API_ERROR_MESSAGES.HTTP
    );
  }

  const json: { data: CharacterData } = await response.json();
  const attrs = json.data.attributes;

  return {
    id: json.data.id,
    name: attrs.name || 'Unnamed',
    house: attrs.house ?? null,
    species: attrs.species ?? null,
    gender: attrs.gender ?? null,
    image: attrs.image ?? null,

    born: attrs.born ?? null,
    died: attrs.died ?? null,
    blood_status: attrs.blood_status ?? null,
    nationality: attrs.nationality ?? null,
    patronus: attrs.patronus ?? null,
    wands: attrs.wands ?? null,
    jobs: attrs.jobs ?? null,
    alias_names: attrs.alias_names ?? undefined,
  };
}
