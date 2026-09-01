import { NextIntlClientProvider } from 'next-intl';
import { getMessages, setRequestLocale } from 'next-intl/server';

import { themeInitScript } from '@/contexts/theme/constants';
import { DEFAULT_LOCALE, DEFAULT_TIMEZONE } from '@/i18n/config';
import { NotFound } from '@views';

import './globals.css';

export default async function RootNotFound() {
  setRequestLocale(DEFAULT_LOCALE);

  const messages = await getMessages();

  return (
    <html lang={DEFAULT_LOCALE} suppressHydrationWarning>
      <head>
        <script
          id="theme-init"
          dangerouslySetInnerHTML={{ __html: themeInitScript }}
        />
      </head>
      <body>
        <NextIntlClientProvider
          locale={DEFAULT_LOCALE}
          messages={messages}
          timeZone={DEFAULT_TIMEZONE}
        >
          <div className="app-shell">
            <NotFound />
          </div>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
