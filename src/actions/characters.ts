'use server';

import { API_CONFIG } from '@api';
import type { Character, SearchResponse } from '@api';
import type { CharacterData } from '@/api/types';

export async function searchCharactersAction(
  name: string,
  page: number,
  size: number = API_CONFIG.ITEMS_PER_PAGE
): Promise<SearchResponse> {
  const params = new URLSearchParams();

  if (name.trim()) {
    params.append('filter[name_cont]', name.trim());
  }

  params.append('page[number]', String(page));
  params.append('page[size]', String(size));

  const url = `${API_CONFIG.BASE_URL}?${params.toString()}`;

  const res = await fetch(url);
  if (!res.ok) {
    throw new Error('Failed to fetch characters');
  }

  const json = await res.json();

  const items: Character[] = json.data.map((item: CharacterData) => ({
    id: item.id,
    name: item.attributes.name || 'Unnamed',
    house: item.attributes.house ?? null,
    species: item.attributes.species ?? null,
    gender: item.attributes.gender ?? null,
    image: item.attributes.image ?? null,
  }));

  const pages = json.meta?.pagination
    ? {
        pagination: json.meta.pagination,
        links: json.links || {},
      }
    : null;

  return { items, pages };
}

export async function getCharacterAction(id: string): Promise<Character> {
  const res = await fetch(`${API_CONFIG.BASE_URL}/${id}`);

  if (!res.ok) {
    throw new Error('Failed to fetch character');
  }

  const json = await res.json();
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
    alias_names: attrs.alias_names,
  };
}
