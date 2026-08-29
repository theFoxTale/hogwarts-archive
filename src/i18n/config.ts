export const LOCALES = ['en', 'ru'] as const;

export type AppLocale = (typeof LOCALES)[number];

export const DEFAULT_LOCALE: AppLocale = 'en';
export const DEFAULT_TIMEZONE = 'Europe/Moscow';
