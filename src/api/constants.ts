export const API_CONFIG = {
  BASE_URL: 'https://api.potterdb.com/v1/characters',
  ITEMS_PER_PAGE: 3,
  USE_MOCK_API: import.meta.env.VITE_USE_MOCK_API === 'true',
  MOCK_DELAY_MS: Number(import.meta.env.VITE_MOCK_DELAY_MS) || 0,
};

// Сообщения об ошибках (технические и пользовательские)
export const API_ERROR_MESSAGES = {
  NOT_FOUND: 'No characters match your search.',
  SERVER: 'Server error has occurred, please try again later.',
  HTTP: 'HTTP error has occurred, please try again later.',
} as const;
