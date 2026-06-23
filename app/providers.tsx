'use client';

import { ReactNode } from 'react';
import { Provider } from 'react-redux';
import { store } from '@store';
import { ThemeProvider } from '@contexts';

export function Providers({ children }: { children: ReactNode }) {
  return (
    <Provider store={store}>
      <ThemeProvider>{children}</ThemeProvider>
    </Provider>
  );
}
