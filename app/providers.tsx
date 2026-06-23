'use client';

import { NextIntlClientProvider } from 'next-intl';
import { ReactNode, createContext, useContext, useState } from 'react';
import { Provider } from 'react-redux';

import { store } from '@store';
import { ThemeProvider } from '@contexts';

import enMessages from '../messages/en.json';
import ruMessages from '../messages/ru.json';

const messagesMap = {
  en: enMessages,
  ru: ruMessages,
};

interface LocaleContextType {
  locale: string;
  setLocale: (locale: string) => void;
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
  const [locale, setLocale] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('hogwarts-locale') || 'en';
    }
    return 'en';
  });

  const messages =
    messagesMap[locale as keyof typeof messagesMap] || enMessages;

  const handleSetLocale = (newLocale: string) => {
    setLocale(newLocale);
    localStorage.setItem('hogwarts-locale', newLocale);
  };

  return (
    <Provider store={store}>
      <NextIntlClientProvider locale={locale} messages={messages}>
        <LocaleContext.Provider value={{ locale, setLocale: handleSetLocale }}>
          <ThemeProvider>{children}</ThemeProvider>
        </LocaleContext.Provider>
      </NextIntlClientProvider>
    </Provider>
  );
}
