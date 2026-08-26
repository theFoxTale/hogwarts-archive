import type { Metadata } from 'next';
import { ReactNode } from 'react';

import { Providers } from '@/providers';
import { themeInitScript } from '@/contexts/theme/constants';

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
    <html lang="en" suppressHydrationWarning>
      <body>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
        <Providers>
          <div className="app-shell">{children}</div>
        </Providers>
      </body>
    </html>
  );
}
