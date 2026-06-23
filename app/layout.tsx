import type { Metadata } from 'next';
import { ReactNode } from 'react';

import { Providers } from './providers';

import './globals.css';

export const metadata: Metadata = {
  title: 'Hogwarts Archive',
  description: 'Ministry of Magic • Restricted Section',
  icons: {
    icon: '/hogwarts-icon.png',
  },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
