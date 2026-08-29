import * as React from 'react';
import { Provider } from 'react-redux';
import { NextIntlClientProvider } from 'next-intl';
import { configureStore } from '@reduxjs/toolkit';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';

import { CharacterCard, ANONYMOUS_CARD_IMAGE } from '@features';
import { ThemeProvider } from '@contexts';
import { selectedItemsReducer, toggleSelect } from '@store/slices';
import { DEFAULT_TIMEZONE } from '@/i18n/config';

import type { Character } from '@api';
import { mockLunaCharacter } from './mocks/api';
import enMessages from '../../messages/en.json';

const createTestStore = (initialSelectedIds: string[] = []) => {
  const initialState = initialSelectedIds.reduce(
    (acc, id) => {
      acc[id] = {
        id,
        name: '',
        house: null,
        species: null,
        gender: null,
        image: null,
      };
      return acc;
    },
    {} as Record<string, Character>
  );
  return configureStore({
    reducer: { selectedItems: selectedItemsReducer },
    preloadedState: { selectedItems: initialState },
  });
};

const renderWithStore = (ui: React.ReactElement, store = createTestStore()) => {
  return render(
    <Provider store={store}>
      <NextIntlClientProvider
        locale="en"
        messages={enMessages}
        timeZone={DEFAULT_TIMEZONE}
      >
        <ThemeProvider>{ui}</ThemeProvider>
      </NextIntlClientProvider>
    </Provider>
  );
};

describe('CharacterCard', () => {
  const onSelect = vi.fn();

  beforeEach(() => {
    onSelect.mockClear();
  });

  test('renders character name, species, gender, and house text', () => {
    renderWithStore(
      <CharacterCard character={mockLunaCharacter} onSelect={onSelect} />
    );
    expect(screen.getByText('Luna Lovegood')).toBeInTheDocument();
    expect(screen.getByText('Human')).toBeInTheDocument();
    expect(screen.getByText('Female')).toBeInTheDocument();
    expect(screen.getByText('Ravenclaw')).toBeInTheDocument();
  });

  test('displays fallback for missing fields', () => {
    const partialCharacter: Character = {
      id: 'dobby-1',
      name: 'Dobby',
      house: null,
      species: 'Elf',
      gender: null,
      image: null,
    };

    renderWithStore(
      <CharacterCard character={partialCharacter} onSelect={onSelect} />
    );

    expect(screen.getByText('Dobby')).toBeInTheDocument();
    expect(screen.getByText('Elf')).toBeInTheDocument();

    const unknownElements = screen.getAllByText('Unknown');
    expect(unknownElements).toHaveLength(2);
  });

  test('checkbox reflects selection state from Redux', () => {
    const store = createTestStore(['luna-1']);
    renderWithStore(
      <CharacterCard character={mockLunaCharacter} onSelect={onSelect} />,
      store
    );

    const checkbox = screen.getByRole('checkbox') as HTMLInputElement;
    expect(checkbox.checked).toBe(true);
  });

  test('clicking checkbox toggles selection and does not select the card', () => {
    const store = createTestStore();
    const dispatchSpy = vi.spyOn(store, 'dispatch');

    renderWithStore(
      <CharacterCard character={mockLunaCharacter} onSelect={onSelect} />,
      store
    );

    fireEvent.click(screen.getByRole('checkbox'));

    expect(dispatchSpy).toHaveBeenCalledWith(toggleSelect(mockLunaCharacter));
    expect(onSelect).not.toHaveBeenCalled();
  });

  test('click on main card area selects the character', () => {
    renderWithStore(
      <CharacterCard character={mockLunaCharacter} onSelect={onSelect} />
    );

    const clickableArea = document.querySelector('.character-card');
    expect(clickableArea).toBeInTheDocument();

    fireEvent.click(clickableArea!);
    expect(onSelect).toHaveBeenCalledWith('luna-1');
  });

  test('displays character image (avatar) and handles missing image', async () => {
    const characterWithoutImage: Character = {
      ...mockLunaCharacter,
      image: null,
    };

    renderWithStore(
      <CharacterCard character={characterWithoutImage} onSelect={onSelect} />
    );

    const img = screen.getByRole('img', { name: 'Luna Lovegood' });
    expect(img).toHaveAttribute('src', ANONYMOUS_CARD_IMAGE);
  });

  test('displays provided image when available', () => {
    const characterWithImage: Character = {
      ...mockLunaCharacter,
      image: 'https://example.com/luna.jpg',
    };

    renderWithStore(
      <CharacterCard character={characterWithImage} onSelect={onSelect} />
    );

    const img = screen.getByRole('img', { name: 'Luna Lovegood' });
    expect(img).toHaveAttribute('src', 'https://example.com/luna.jpg');
  });

  test('falls back to anonymous image on load error', async () => {
    renderWithStore(
      <CharacterCard character={mockLunaCharacter} onSelect={onSelect} />
    );

    const img = screen.getByRole('img', { name: 'Luna Lovegood' });
    fireEvent.error(img);

    await waitFor(() => {
      expect(img).toHaveAttribute('src', ANONYMOUS_CARD_IMAGE);
    });
  });

  test('renders house icon (img with alt text of house name)', () => {
    renderWithStore(
      <CharacterCard character={mockLunaCharacter} onSelect={onSelect} />
    );

    const houseIcon = screen.getByAltText('Ravenclaw');

    expect(houseIcon).toBeInTheDocument();
    expect(houseIcon.closest('.trait-item')).toBeInTheDocument();
  });
});
