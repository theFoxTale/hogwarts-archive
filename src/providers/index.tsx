'use client';

import { NextIntlClientProvider } from 'next-intl';
import {
  ReactNode,
  createContext,
  useContext,
  useSyncExternalStore,
} from 'react';
import { Provider } from 'react-redux';

import { store } from '@store';
import { ThemeProvider } from '@contexts';
import { DEFAULT_TIMEZONE, type AppLocale } from '@/i18n/config';
import {
  applyLocale,
  getLocaleSnapshot,
  getServerLocaleSnapshot,
  subscribeToLocale,
} from '@/i18n/localeStore';

import enMessages from '../../messages/en.json';
import ruMessages from '../../messages/ru.json';

const messagesMap = {
  en: enMessages,
  ru: ruMessages,
};

interface LocaleContextType {
  locale: AppLocale;
  setLocale: (locale: AppLocale) => void;
}

const LocaleContext = createContext<LocaleContextType | undefined>(undefined);

export const useLocaleContext = () => {
  const context = useContext(LocaleContext);
  if (!context) {
    throw new Error('useLocaleContext must be used within a Providers');
  }
  return context;
};

export function Providers({ children }: { children: ReactNode }) {
  const locale = useSyncExternalStore(
    subscribeToLocale,
    getLocaleSnapshot,
    getServerLocaleSnapshot
  );

  const messages = messagesMap[locale] || enMessages;

  return (
    <Provider store={store}>
      <NextIntlClientProvider
        locale={locale}
        messages={messages}
        timeZone={DEFAULT_TIMEZONE}
      >
        <LocaleContext.Provider value={{ locale, setLocale: applyLocale }}>
          <ThemeProvider>{children}</ThemeProvider>
        </LocaleContext.Provider>
      </NextIntlClientProvider>
    </Provider>
  );
}
