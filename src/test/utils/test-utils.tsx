import type { ReactElement } from 'react';
import { render } from '@testing-library/react';
import { Provider } from 'react-redux';
import { MemoryRouter, Route, Routes } from 'react-router-dom';

import { ThemeProvider } from '@contexts';

import { configureStore } from '@reduxjs/toolkit';
import { selectedItemsReducer } from '@store/slices';
import { charactersApi } from '@api';

export const createTestStore = (preloadedState = {}) => {
  return configureStore({
    reducer: {
      selectedItems: selectedItemsReducer,
      [charactersApi.reducerPath]: charactersApi.reducer,
    },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware().concat(charactersApi.middleware),
    preloadedState,
  });
};

export function renderWithProviders(
  ui: ReactElement,
  { route = '/', store = createTestStore() } = {}
) {
  return render(
    <Provider store={store}>
      <ThemeProvider>
        <MemoryRouter initialEntries={[route]}>
          <Routes>
            <Route path="*" element={ui} />
          </Routes>
        </MemoryRouter>
      </ThemeProvider>
    </Provider>
  );
}
