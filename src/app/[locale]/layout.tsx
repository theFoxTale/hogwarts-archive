import type { Metadata } from 'next';
import { hasLocale } from 'next-intl';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages, setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';
import type { ReactNode } from 'react';

import { Providers } from '@/providers';
import { ThemeInitScript } from '@/contexts/theme/ThemeInitScript';
import { DEFAULT_TIMEZONE } from '@/i18n/config';
import { routing } from '@/i18n/routing';

type Props = {
  children: ReactNode;
  params: Promise<{ locale: string }>;
};

export const metadata: Metadata = {
  title: 'Hogwarts Archive',
  description: 'Ministry of Magic • Restricted Section',
  icons: {
    icon: '/hogwarts-icon.png',
  },
};

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({ children, params }: Props) {
  const { locale } = await params;

  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  setRequestLocale(locale);

  const messages = await getMessages();

  return (
    <html lang={locale} suppressHydrationWarning>
      <head>
        <ThemeInitScript />
      </head>
      <body>
        <NextIntlClientProvider
          locale={locale}
          messages={messages}
          timeZone={DEFAULT_TIMEZONE}
        >
          <Providers>
            <div className="app-shell">{children}</div>
          </Providers>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
