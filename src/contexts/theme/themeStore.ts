import { DEFAULT_THEME, THEME_STORAGE_KEY } from './constants';
import type { Theme } from './types';

const listeners = new Set<() => void>();

function isTheme(value: string | null): value is Theme {
  return value === 'light' || value === 'dark';
}

function emit() {
  for (const listener of listeners) {
    listener();
  }
}

export function getThemeSnapshot(): Theme {
  const saved = localStorage.getItem(THEME_STORAGE_KEY);
  if (isTheme(saved)) return saved;

  return window.matchMedia('(prefers-color-scheme: dark)').matches
    ? 'dark'
    : DEFAULT_THEME;
}

export function getServerThemeSnapshot(): Theme {
  return DEFAULT_THEME;
}

export function subscribeToTheme(listener: () => void) {
  listeners.add(listener);

  window.addEventListener('storage', listener);

  const media = window.matchMedia('(prefers-color-scheme: dark)');
  media.addEventListener('change', listener);

  return () => {
    listeners.delete(listener);
    window.removeEventListener('storage', listener);
    media.removeEventListener('change', listener);
  };
}

export function applyTheme(theme: Theme) {
  localStorage.setItem(THEME_STORAGE_KEY, theme);
  document.documentElement.setAttribute('data-theme', theme);
  emit();
}
