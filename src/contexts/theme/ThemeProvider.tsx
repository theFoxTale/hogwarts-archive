import { useState, useEffect, type ReactNode } from 'react';
import { ThemeContext } from './themeContext';
import type { Theme } from './types';

const THEME_STORAGE_KEY = 'hogwarts-theme';

// Функция для получения начальной темы (выполняется только на клиенте)
function getInitialTheme(): Theme {
  if (typeof window === 'undefined') {
    return 'light';
  }

  const saved = localStorage.getItem(THEME_STORAGE_KEY) as Theme | null;
  if (saved === 'light' || saved === 'dark') {
    return saved;
  }

  const isDarkPreferred = window.matchMedia(
    '(prefers-color-scheme: dark)'
  ).matches;
  return isDarkPreferred ? 'dark' : 'light';
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<Theme>(getInitialTheme);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem(THEME_STORAGE_KEY, theme);
  }, [theme]);

  const toggleTheme = () =>
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}
