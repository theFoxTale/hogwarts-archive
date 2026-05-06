export const APP_STRINGS = {
  APP_NAME: "Harry Potter's API Test Page",
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

export const UI_MESSAGES = {
  ERROR_BOUNDARY: 'ErrorBoundary caught an error:',
  ERROR_GENERIC: 'Failed to load characters. Please try again later.',
  LOADING: 'Loading characters...',
  NO_RESULTS: 'No characters found. Try another name.',
  TEST_ERROR: 'This is special error from test button',
  UNKNOWN_ERROR: 'Unknown error',
  FALLBACK_TITLE: 'Something went wrong',
  TRY_AGAIN: 'Try again',
  SEARCH_PLACEHOLDER: 'Search characters...',
} as const;

export const ANONYMOUS_IMAGE = '/placeholder.jpg';
