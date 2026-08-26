import { DEFAULT_LOCALE, LOCALE_STORAGE_KEY, type AppLocale } from './config';

const listeners = new Set<() => void>();

function isLocale(value: string | null): value is AppLocale {
  return value === 'en' || value === 'ru';
}

function emit() {
  for (const listener of listeners) {
    listener();
  }
}

export function getLocaleSnapshot(): AppLocale {
  const saved = localStorage.getItem(LOCALE_STORAGE_KEY);
  return isLocale(saved) ? saved : DEFAULT_LOCALE;
}

export function getServerLocaleSnapshot(): AppLocale {
  return DEFAULT_LOCALE;
}

export function subscribeToLocale(listener: () => void) {
  listeners.add(listener);
  window.addEventListener('storage', listener);

  return () => {
    listeners.delete(listener);
    window.removeEventListener('storage', listener);
  };
}

export function applyLocale(locale: AppLocale) {
  localStorage.setItem(LOCALE_STORAGE_KEY, locale);
  emit();
}
