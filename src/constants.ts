export const APP_STRINGS = {
  APP_NAME: 'Hogwarts Archive',
  APP_DESCRIPTION: 'Search the wizarding world',
  APP_EMBLEM_TOOLTIP: 'Hogwarts Emblem',
  APP_ORNAMENT_TOOLTIP: 'Header Ornament',
  ERROR_BUTTON_TOOLTIP: 'Simulate Error',
} as const;

export const API_CONFIG = {
  BASE_URL: 'https://api.potterdb.com/v1/characters',
  ITEMS_PER_PAGE: 3,
} as const;

export const LOCAL_STORAGE_KEYS = {
  SEARCH_TEXT: 'classComponentSearchText',
  SEARCH_PAGE: 'classComponentSearchPage',
} as const;

// Сообщения об ошибках (технические и пользовательские)
export const ERROR_MESSAGES = {
  BOUNDARY: 'ErrorBoundary caught an error:',
  NOT_FOUND: 'No characters match your search.',
  SERVER: 'Server error has occurred, please try again later.',
  HTTP: 'HTTP error has occurred, please try again later.',
  TEST: 'This is special error from test button',
  UNKNOWN: 'Unknown error',
} as const;

// Тексты интерфейса (пользовательские сообщения, заголовки, кнопки)
export const UI_MESSAGES = {
  LOADING: 'Loading characters...',
  NO_RESULTS: 'No characters found. Try another name.',
  FALLBACK_TITLE: 'Something went wrong',
  TRY_AGAIN: 'Try again',
  SEARCH_PLACEHOLDER: 'Search characters...',
  SEARCH_BUTTON_TEXT: 'Accio',
} as const;

// constants.ts
export const ANONYMOUS_IMAGE = `${import.meta.env.BASE_URL}/placeholder.jpg`;

export const LOADING_DELAY = {
  IS_SIMULATED: true,
  TIME_MS: 300,
} as const;
