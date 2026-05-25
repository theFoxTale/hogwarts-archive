import '@testing-library/jest-dom';
import { cleanup } from '@testing-library/react';
import { afterEach, vi } from 'vitest';

import './mocks/localStorage';

afterEach(() => {
  cleanup();
  vi.clearAllMocks();
});

// mock для import.meta.env.BASE_URL
vi.stubEnv('BASE_URL', '/');

// mock для fetch
globalThis.fetch = vi.fn();

Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation((query) => ({
    matches: query !== '(prefers-color-scheme: dark)',
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});
