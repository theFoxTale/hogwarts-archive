import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { fireEvent, render, screen } from '@testing-library/react';

import selectedItemsReducer, { clearAll } from '../features/selectedItemsSlice';
import * as csvExport from '../utils/csvExport';
import { FLYOUT_STRINGS } from '../constants';
import { Flyout } from '../components';

import type { Character } from '../api';
import { mockCharacters, mockHarryCharacter } from './mocks/api';

vi.mock('../utils/csvExport', () => ({
  exportToCSV: vi.fn(),
}));

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
      <Flyout />
    </Provider>
  );
};

describe('Flyout tests', () => {
  test('does not render when no items selected', () => {
    const store = createStoreWithItems();
    renderWithStore(store);
    expect(
      screen.queryByText(`${FLYOUT_STRINGS.SELECTED_LABEL}: 1`)
    ).not.toBeInTheDocument();
  });

  test('renders when at least one item selected', () => {
    const store = createStoreWithItems([mockHarryCharacter]);
    renderWithStore(store);
    expect(
      screen.getByText(`${FLYOUT_STRINGS.SELECTED_LABEL}: 1`)
    ).toBeInTheDocument();
  });

  test('displays correct count', () => {
    const store = createStoreWithItems(mockCharacters);
    renderWithStore(store);
    expect(
      screen.getByText(`${FLYOUT_STRINGS.SELECTED_LABEL}: 2`)
    ).toBeInTheDocument();
  });

  test('Unselect all button dispatches clearAll', () => {
    const store = createStoreWithItems([mockHarryCharacter]);
    const dispatchSpy = vi.spyOn(store, 'dispatch');
    renderWithStore(store);
    fireEvent.click(screen.getByText(FLYOUT_STRINGS.UNSELECT_ALL));
    expect(dispatchSpy).toHaveBeenCalledWith(clearAll());
  });

  test('Download button calls exportToCSV with selected items', () => {
    const store = createStoreWithItems([mockHarryCharacter]);
    renderWithStore(store);
    fireEvent.click(screen.getByText(FLYOUT_STRINGS.DOWNLOAD_CSV));
    expect(csvExport.exportToCSV).toHaveBeenCalledWith([mockHarryCharacter]);
  });
});
