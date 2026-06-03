import { vi } from 'vitest';

type MockResponse = {
  data?: object;
  ok?: boolean;
  status?: number;
  statusText?: string;
  headers?: HeadersInit;
};

/**
 * Подменяет fetch на один вызов с заданным ответом.
 */
export function mockFetch({
  data = {},
  status = 200,
  statusText = 'OK',
  headers = { 'Content-Type': 'application/json' },
}: MockResponse = {}) {
  const body = JSON.stringify(data);
  const response = new Response(body, { status, statusText, headers });

  response.json = async () => data;
  return vi.spyOn(globalThis, 'fetch').mockResolvedValueOnce(response);
}
