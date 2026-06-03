import { createApi } from '@reduxjs/toolkit/query/react';

import { API_CONFIG } from './constants';
import type {
  Character,
  ApiResponse,
  SearchResponse,
  CharacterData,
} from './types';
import { customBaseQuery } from './customBaseQuery';

export const charactersApi = createApi({
  reducerPath: 'charactersApi',
  baseQuery: customBaseQuery,
  tagTypes: ['Characters', 'Character'],
  keepUnusedDataFor: Number(import.meta.env.VITE_CACHE_TTL) || 60,
  endpoints: (builder) => ({
    searchCharacters: builder.query<
      SearchResponse,
      { name?: string; page?: number; size?: number }
    >({
      query: ({ name = '', page = 1, size = API_CONFIG.ITEMS_PER_PAGE }) => {
        const params = new URLSearchParams();

        if (name.trim()) {
          params.append('filter[name_cont]', name.trim());
        }

        params.append('page[number]', String(page));
        params.append('page[size]', String(size));

        return `?${params.toString()}`;
      },
      transformResponse: (response: ApiResponse): SearchResponse => {
        const items: Character[] =
          response.data?.map((item: CharacterData) => ({
            id: item.id,
            name: item.attributes.name || 'Unnamed',
            house: item.attributes.house ?? null,
            species: item.attributes.species ?? null,
            gender: item.attributes.gender ?? null,
            image: item.attributes.image ?? null,
          })) ?? [];
        const pages = response.meta?.pagination
          ? {
              pagination: response.meta.pagination,
              links: response.links,
            }
          : null;

        return { items, pages };
      },
      providesTags: (result) =>
        result?.items
          ? [
              ...result.items.map((c) => ({
                type: 'Character' as const,
                id: c.id,
              })),
              { type: 'Characters', id: 'LIST' },
            ]
          : [{ type: 'Characters', id: 'LIST' }],
    }),
    getCharacterById: builder.query<Character, string>({
      query: (id) => `/${id}`,
      transformResponse: (response: { data: CharacterData }): Character => {
        const attrs = response.data.attributes;
        return {
          id: response.data.id,
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
      },
      providesTags: (_, __, id) => [{ type: 'Character', id }],
    }),
  }),
});

export const { useSearchCharactersQuery, useGetCharacterByIdQuery } =
  charactersApi;
