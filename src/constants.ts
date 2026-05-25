export const APP_STRINGS = {
  APP_NAME: 'Hogwarts Archive',
  APP_DESCRIPTION: 'Ministry of Magic • Restricted Section',
  APP_EMBLEM_TOOLTIP: 'Hogwarts Emblem',
  APP_ORNAMENT_TOOLTIP: 'Header Ornament',
  ERROR_BUTTON_TOOLTIP: 'Simulate Error',
} as const;

export const API_CONFIG = {
  BASE_URL: 'https://api.potterdb.com/v1/characters',
  ITEMS_PER_PAGE: 3,
  USE_MOCK_API: import.meta.env.VITE_USE_MOCK_API === 'true',
  MOCK_DELAY_MS: Number(import.meta.env.VITE_MOCK_DELAY_MS) || 0,
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
  SEARCH_HEADER: 'Search witches, wizards, and magical beings',
  SEARCH_PLACEHOLDER: 'Find magical records...',
  SEARCH_BUTTON_TEXT: 'Accio',
  NO_DETAILS: 'No records in the magical archives',
} as const;

export const ANONYMOUS_IMAGE = `${import.meta.env.BASE_URL}/placeholder.png`;

export const LOADING_DELAY = {
  IS_SIMULATED: true,
  TIME_MS: 300,
} as const;

export const SEARCH_STRINGS = {
  SEARCH_DESCRIPTION: 'Magical Archive Record',
  SEARCH_LINE_TOOLTIP: 'Line Emblem',
  SEARCH_PARTS_TOOLTIP: 'Part Emblem',

  CARD_HOUSE_LABEL: 'House',
  CARD_SPECIES_LABEL: 'Species',
  CARD_GENDER_LABEL: 'Gender',

  CLEAR_BUTTON_LABEL: 'Clear search',
} as const;

export const FLYOUT_STRINGS = {
  SELECTED_LABEL: 'Selected',
  UNSELECT_ALL: 'Unselect all',
  DOWNLOAD_CSV: 'Download CSV',
} as const;

export const CSV_EXPORT = {
  FILE_NAME: '_items',
} as const;

export const PAGINATION_STRINGS = {
  PREVIOUS: '← Previous',
  NEXT: 'Next →',
  PAGE_OF: (current: number, total: number) => `Page ${current} of ${total}`,
} as const;

export const DETAILS_STRINGS = {
  CLOSE: '✖',
  BASIC_INFO: 'Basic Info',
  LIFE: 'Life',
  HERITAGE: 'Heritage',
  MAGIC: 'Magic',
  WANDS: 'Wand(s)',
  OCCUPATIONS: 'Occupation(s)',
  STILL_ALIVE: 'Still alive',
  UNKNOWN: 'Unknown',
  HOUSE: 'House',
  SPECIES: 'Species',
  GENDER: 'Gender',
  BORN: 'Born',
  DIED: 'Died',
  BLOOD_STATUS: 'Blood Status',
  NATIONALITY: 'Nationality',
  PATRONUS: 'Patronus',
} as const;

export const ABOUT_STRINGS = {
  TEXT: 'ABOUT',
} as const;

export const THEME_STRINGS = {
  ALT_LIGHT: 'Light theme',
  ALT_DARK: 'Dark theme',
} as const;

export const CHARACTER_CARD_STRINGS = {
  UNKNOWN: 'Unknown',
} as const;
