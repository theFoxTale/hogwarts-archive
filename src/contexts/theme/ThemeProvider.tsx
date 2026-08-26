'use client';

import { useEffect, useSyncExternalStore, type ReactNode } from 'react';

import { ThemeContext } from './themeContext';
import {
  applyTheme,
  getServerThemeSnapshot,
  getThemeSnapshot,
  subscribeToTheme,
} from './themeStore';

export function ThemeProvider({ children }: { children: ReactNode }) {
  const theme = useSyncExternalStore(
    subscribeToTheme,
    getThemeSnapshot,
    getServerThemeSnapshot
  );

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  const toggleTheme = () => applyTheme(theme === 'light' ? 'dark' : 'light');

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}
