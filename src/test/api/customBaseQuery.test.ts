import { API_CONFIG } from '@api';
import { customBaseQuery } from '@api';

import { mockFetch } from '../mocks/fetchMock';
import { baseQueryApiMock } from '../mocks/baseQueryApi';

describe('customBaseQuery', () => {
  let originalConfig: typeof API_CONFIG;

  beforeEach(() => {
    originalConfig = { ...API_CONFIG };
    // По умолчанию реальный запрос данных
    API_CONFIG.USE_MOCK_API = false;
    API_CONFIG.MOCK_DELAY_MS = 0;
  });

  afterEach(() => {
    Object.assign(API_CONFIG, originalConfig);
    vi.restoreAllMocks();
  });

  describe('real mode', () => {
    test('performs fetch request with correct URL', async () => {
      mockFetch({ data: { data: [] } });

      const result = await customBaseQuery(
        '/characters',
        baseQueryApiMock(),
        {}
      );

      expect(vi.mocked(globalThis.fetch)).toHaveBeenCalledTimes(1);
      const callArg = vi.mocked(globalThis.fetch).mock.calls[0][0];
      expect(callArg).toBeInstanceOf(Request);
      expect((callArg as Request).url).toBe(
        'https://api.potterdb.com/v1/characters/characters'
      );
      expect(result.data).toEqual({ data: [] });
    });
  });

  describe('mock mode', () => {
    beforeEach(() => {
      API_CONFIG.USE_MOCK_API = true;
      API_CONFIG.MOCK_DELAY_MS = 0;
    });

    test('returns mock data for search', async () => {
      const result = await customBaseQuery(
        '?filter[name_cont]=Harry&page[number]=1&page[size]=3',
        baseQueryApiMock(),
        {}
      );

      expect(vi.mocked(globalThis.fetch)).not.toHaveBeenCalled();
      expect(result.error).toBeUndefined();
      expect(result.data).toBeDefined();
    });

    test('returns mock data for character by id', async () => {
      const result = await customBaseQuery('/1', baseQueryApiMock(), {});
      expect(result.error).toBeUndefined();
      expect(result.data).toBeDefined();
    });

    test('handles 404', async () => {
      const result = await customBaseQuery('/unknown', baseQueryApiMock(), {});
      expect(result.data).toBeUndefined();
      expect(result.error).toBeDefined();
      expect((result.error as { status: number }).status).toBe(404);
    });

    test('respects mock delay', async () => {
      API_CONFIG.MOCK_DELAY_MS = 100;
      const start = Date.now();
      await customBaseQuery('/1', baseQueryApiMock(), {});
      const duration = Date.now() - start;
      expect(duration).toBeGreaterThanOrEqual(90);
    });
  });
});
