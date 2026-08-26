import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { NextIntlClientProvider } from 'next-intl';

import { clearAll, selectedItemsReducer } from '@store/slices';
import { ThemeProvider } from '@contexts';
import { Flyout } from '@features';
import { DEFAULT_TIMEZONE } from '@/i18n/config';
import { LocaleProvider } from '@/providers';

import type { Character } from '@api';
import { mockCharacters, mockHarryCharacter } from './mocks/api';
import enMessages from '../../messages/en.json';

const createStoreWithItems = (items: Character[] = []) => {
  const selected = items.reduce(
    (acc, item) => {
      acc[item.id] = item;
      return acc;
    },
    {} as Record<string, Character>
  );

  return configureStore({
    reducer: { selectedItems: selectedItemsReducer },
    preloadedState: { selectedItems: selected },
  });
};

const renderWithStore = (store: ReturnType<typeof createStoreWithItems>) => {
  return render(
    <Provider store={store}>
      <NextIntlClientProvider
        locale="en"
        messages={enMessages}
        timeZone={DEFAULT_TIMEZONE}
      >
        <LocaleProvider>
          <ThemeProvider>
            <Flyout />
          </ThemeProvider>
        </LocaleProvider>
      </NextIntlClientProvider>
    </Provider>
  );
};

describe('Flyout', () => {
  test('does not render when no items selected', () => {
    const store = createStoreWithItems();
    renderWithStore(store);
    expect(screen.queryByText('Selected 1')).not.toBeInTheDocument();
  });

  test('renders when at least one item selected', () => {
    const store = createStoreWithItems([mockHarryCharacter]);
    renderWithStore(store);
    expect(screen.getByText('Selected 1')).toBeInTheDocument();
  });

  test('displays correct count', () => {
    const store = createStoreWithItems(mockCharacters);
    renderWithStore(store);
    expect(screen.getByText('Selected 2')).toBeInTheDocument();
  });

  test('Unselect all button dispatches clearAll', () => {
    const store = createStoreWithItems([mockHarryCharacter]);
    const dispatchSpy = vi.spyOn(store, 'dispatch');
    renderWithStore(store);
    fireEvent.click(screen.getByText('Unselect all'));
    expect(dispatchSpy).toHaveBeenCalledWith(clearAll());
  });

  test('Download button requests a CSV export', async () => {
    const store = createStoreWithItems([mockHarryCharacter]);
    vi.spyOn(globalThis, 'fetch').mockResolvedValue({
      ok: true,
      blob: async () => new Blob(['csv']),
      headers: { get: () => 'attachment; filename="beings.csv"' },
    } as Response);
    vi.spyOn(URL, 'createObjectURL').mockReturnValue('blob:test');
    vi.spyOn(URL, 'revokeObjectURL').mockImplementation(() => {});

    renderWithStore(store);
    fireEvent.click(screen.getByText('Download CSV'));

    await waitFor(() => {
      expect(globalThis.fetch).toHaveBeenCalledWith(
        '/api/export-csv',
        expect.objectContaining({ method: 'POST' })
      );
    });
  });
});
