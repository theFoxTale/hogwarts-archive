import type {
  Character,
  CharacterData,
  ApiResponse,
  SearchResponse,
} from './types';

export function mapCharacter(item: CharacterData): Character {
  const attrs = item.attributes;

  return {
    id: item.id,
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
    alias_names: attrs.alias_names,
    wiki: attrs.wiki ?? null,
  };
}

export function mapSearchResponse(response: ApiResponse): SearchResponse {
  const items = response.data?.map(mapCharacter) ?? [];
  const pages = response.meta?.pagination
    ? {
        pagination: response.meta.pagination,
        links: {
          self: '',
          ...response.links,
        },
      }
    : null;

  return { items, pages };
}
