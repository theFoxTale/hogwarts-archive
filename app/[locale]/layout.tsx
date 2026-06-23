import type { Metadata } from 'next';
import { ReactNode } from 'react';

import { getMessages } from 'next-intl/server';
import { NextIntlClientProvider } from 'next-intl';

import { Providers } from './providers';

import './globals.css';

export const metadata: Metadata = {
  title: 'Hogwarts Archive',
  description: 'Ministry of Magic • Restricted Section',
  icons: {
    icon: '/hogwarts-icon.png',
  },
};

export default async function LocaleLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const messages = await getMessages({ locale });

  return (
    <html lang={locale}>
      <body>
        <NextIntlClientProvider messages={messages}>
          <Providers>{children}</Providers>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
