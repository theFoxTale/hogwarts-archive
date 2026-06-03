import { useMemo } from 'react';
import { useTheme } from '@contexts';

export function useThemeImages<T>(images: { light: T; dark: T }): T {
  const { theme } = useTheme();
  return useMemo(() => images[theme], [images, theme]);
}
