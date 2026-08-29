'use client';

import { useServerInsertedHTML } from 'next/navigation';

import { themeInitScript } from './constants';

export function ThemeInitScript() {
  useServerInsertedHTML(() => (
    <script
      id="theme-init"
      dangerouslySetInnerHTML={{ __html: themeInitScript }}
    />
  ));

  return null;
}
