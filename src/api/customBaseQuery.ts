import { fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type {
  BaseQueryFn,
  FetchArgs,
  FetchBaseQueryError,
} from '@reduxjs/toolkit/query';

import { mockSearchCharacters, mockGetCharacterById } from './mockService';
import { API_CONFIG } from './constants';

export const customBaseQuery: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  if (API_CONFIG.MOCK_DELAY_MS > 0) {
    await new Promise((resolve) =>
      setTimeout(resolve, API_CONFIG.MOCK_DELAY_MS)
    );
  }

  let fetchArgs: FetchArgs;
  if (typeof args === 'string') {
    fetchArgs = { url: args, method: 'GET' };
  } else {
    fetchArgs = args as FetchArgs;
  }
  const { url } = fetchArgs;

  if (API_CONFIG.USE_MOCK_API) {
    // Мок-режим (без интернета)
    if (url.startsWith('/') && url !== '/') {
      const id = url.slice(1);
      try {
        const character = await mockGetCharacterById(id);
        return {
          data: {
            data: {
              id: character.id,
              type: 'character',
              attributes: character,
            },
          },
        };
      } catch (error) {
        return { error: { status: 404, data: (error as Error).message } };
      }
    } else {
      const params = new URLSearchParams(url.split('?')[1] || '');
      const name = params.get('filter[name_cont]') || '';
      const page = parseInt(params.get('page[number]') || '1');
      const size = parseInt(
        params.get('page[size]') || String(API_CONFIG.ITEMS_PER_PAGE)
      );
      const result = await mockSearchCharacters(name, page, size);

      const data = result.items.map((item) => ({
        id: item.id,
        type: 'character',
        attributes: item,
      }));
      const meta = result.pages?.pagination
        ? { pagination: result.pages.pagination }
        : undefined;
      return {
        data: {
          data,
          meta,
          links: result.pages?.links || {},
        },
      };
    }
  } else {
    // Реальный режим: используем fetchBaseQuery ---
    return fetchBaseQuery({ baseUrl: API_CONFIG.BASE_URL })(
      args,
      api,
      extraOptions
    );
  }
};
