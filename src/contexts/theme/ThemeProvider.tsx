import { useState, useEffect, type ReactNode } from 'react';
import { ThemeContext } from './themeContext';
import type { Theme } from './types';

const THEME_STORAGE_KEY = 'hogwarts-theme';

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<Theme>(() => {
    if (typeof window === 'undefined') return 'light';

    const saved = localStorage.getItem(THEME_STORAGE_KEY) as Theme | null;
    if (saved === 'light' || saved === 'dark') return saved;

    const isDarkPreferred = window.matchMedia(
      '(prefers-color-scheme: dark)'
    ).matches;
    return isDarkPreferred ? 'dark' : 'light';
  });

  useEffect(() => {
    if (typeof window === 'undefined') return;

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
