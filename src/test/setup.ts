import '@testing-library/jest-dom';
import { cleanup } from '@testing-library/react';
import { afterEach, vi } from 'vitest';

afterEach(() => {
  cleanup();
  vi.clearAllMocks();
});

// mock для import.meta.env.BASE_URL
vi.stubEnv('BASE_URL', '/');

// mock для fetch
globalThis.fetch = vi.fn();
