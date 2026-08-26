import type { ReactElement, ReactNode } from 'react';
import { render } from '@testing-library/react';
import { Provider } from 'react-redux';
import { NextIntlClientProvider } from 'next-intl';
import { configureStore } from '@reduxjs/toolkit';

import { ThemeProvider } from '@contexts';
import { selectedItemsReducer } from '@store/slices';
import { DEFAULT_TIMEZONE } from '@/i18n/config';
import { LocaleProvider } from '@/providers';

import enMessages from '../../../messages/en.json';

export const createTestStore = (preloadedState = {}) => {
  return configureStore({
    reducer: {
      selectedItems: selectedItemsReducer,
    },
    preloadedState,
  });
};

function AppProviders({
  children,
  store = createTestStore(),
}: {
  children: ReactNode;
  store?: ReturnType<typeof createTestStore>;
}) {
  return (
    <Provider store={store}>
      <NextIntlClientProvider
        locale="en"
        messages={enMessages}
        timeZone={DEFAULT_TIMEZONE}
      >
        <LocaleProvider>
          <ThemeProvider>{children}</ThemeProvider>
        </LocaleProvider>
      </NextIntlClientProvider>
    </Provider>
  );
}

export function renderWithProviders(
  ui: ReactElement,
  { store = createTestStore() } = {}
) {
  return render(<AppProviders store={store}>{ui}</AppProviders>);
}
