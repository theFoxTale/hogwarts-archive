import { vi } from 'vitest';
import type { BaseQueryApi } from '@reduxjs/toolkit/query';

export function baseQueryApiMock(): BaseQueryApi {
  return {
    signal: new AbortController().signal,
    abort: vi.fn(),
    dispatch: vi.fn(),
    getState: vi.fn(),
    extra: undefined,
    endpoint: '',
    type: 'query',
    forced: false,
  };
}
