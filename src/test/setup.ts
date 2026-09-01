import '@testing-library/jest-dom/vitest';
import { createElement, type ReactNode } from 'react';
import { cleanup } from '@testing-library/react';
import { afterEach, vi } from 'vitest';

import './mocks/localStorage';

vi.mock('@/i18n/navigation', () => ({
  useRouter: () => ({
    push: vi.fn(),
    replace: vi.fn(),
    prefetch: vi.fn(),
    back: vi.fn(),
    forward: vi.fn(),
    refresh: vi.fn(),
  }),
  usePathname: () => '/',
  Link: ({ href, children }: { href: string; children?: ReactNode }) =>
    createElement('a', { href }, children),
  redirect: vi.fn(),
  getPathname: ({ href }: { href: string }) => href,
}));

vi.mock('next/image', () => ({
  default: (props: Record<string, unknown>) => {
    const imgProps = { ...props };
    delete imgProps.fill;
    delete imgProps.priority;
    delete imgProps.sizes;
    delete imgProps.loader;
    delete imgProps.unoptimized;
    return createElement('img', imgProps);
  },
}));

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
