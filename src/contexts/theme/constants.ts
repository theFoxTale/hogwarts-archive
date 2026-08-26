import type { Theme } from './types';

export const THEME_STORAGE_KEY = 'hogwarts-theme';
export const DEFAULT_THEME: Theme = 'light';

export const themeInitScript = `(function(){try{var t=localStorage.getItem('${THEME_STORAGE_KEY}');if(t!=='light'&&t!=='dark'){t=window.matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light';}document.documentElement.setAttribute('data-theme',t);}catch(e){document.documentElement.setAttribute('data-theme','${DEFAULT_THEME}');}})();`;
