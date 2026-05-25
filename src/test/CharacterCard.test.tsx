import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';
import { configureStore } from '@reduxjs/toolkit';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';

import { CharacterCard } from '../components';
import selectedItemsReducer, {
  toggleSelect,
} from '../features/selectedItemsSlice';
import { ANONYMOUS_IMAGE } from '../constants';

import type { Character } from '../api';
import { mockLunaCharacter } from './mocks/api';

const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

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
      <MemoryRouter>{ui}</MemoryRouter>
    </Provider>
  );
};

describe('CharacterCard', () => {
  beforeEach(() => {
    mockNavigate.mockClear();
  });

  test('renders character name, species, gender, and house text', () => {
    renderWithStore(
      <CharacterCard character={mockLunaCharacter} currentPage={1} />
    );
    expect(screen.getByText('Luna Lovegood')).toBeInTheDocument();
    expect(screen.getByText('Human')).toBeInTheDocument();
    expect(screen.getByText('Female')).toBeInTheDocument();
    expect(screen.getByText('Ravenclaw')).toBeInTheDocument(); // название факультета
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
      <CharacterCard character={partialCharacter} currentPage={1} />
    );

    expect(screen.getByText('Dobby')).toBeInTheDocument();
    expect(screen.getByText('Elf')).toBeInTheDocument();

    // первый - для gender, второй - для факультета
    const unknownElements = screen.getAllByText('Unknown');
    expect(unknownElements).toHaveLength(2);
  });

  test('checkbox reflects selection state from Redux', () => {
    const store = createTestStore(['luna-1']);
    renderWithStore(
      <CharacterCard character={mockLunaCharacter} currentPage={1} />,
      store
    );

    const checkbox = screen.getByRole('checkbox') as HTMLInputElement;
    expect(checkbox.checked).toBe(true);
  });

  test('clicking checkbox toggles selection and does not navigate', () => {
    const store = createTestStore();
    const dispatchSpy = vi.spyOn(store, 'dispatch');

    renderWithStore(
      <CharacterCard character={mockLunaCharacter} currentPage={1} />,
      store
    );

    const checkbox = screen.getByRole('checkbox');
    fireEvent.click(checkbox);

    expect(dispatchSpy).toHaveBeenCalledWith(toggleSelect(mockLunaCharacter));
    expect(mockNavigate).not.toHaveBeenCalled();
  });

  test('click on main card area navigates to details with page param', () => {
    renderWithStore(
      <CharacterCard character={mockLunaCharacter} currentPage={3} />
    );

    const clickableArea = document.querySelector('.character-card');
    expect(clickableArea).toBeInTheDocument();

    fireEvent.click(clickableArea!);
    expect(mockNavigate).toHaveBeenCalledWith('/3/luna-1');
  });

  test('click on checkbox does not trigger navigation (stopPropagation)', () => {
    renderWithStore(
      <CharacterCard character={mockLunaCharacter} currentPage={1} />
    );

    const checkbox = screen.getByRole('checkbox');
    fireEvent.click(checkbox);

    expect(mockNavigate).not.toHaveBeenCalled();
  });

  test('displays character image (avatar) and handles missing image', async () => {
    const characterWithoutImage: Character = {
      ...mockLunaCharacter,
      image: null,
    };

    renderWithStore(
      <CharacterCard character={characterWithoutImage} currentPage={1} />
    );

    const img = screen.getByRole('img', { name: 'Luna Lovegood' });
    expect(img).toHaveAttribute('src', ANONYMOUS_IMAGE);
  });

  test('displays provided image when available', () => {
    const characterWithImage: Character = {
      ...mockLunaCharacter,
      image: 'https://example.com/luna.jpg',
    };

    renderWithStore(
      <CharacterCard character={characterWithImage} currentPage={1} />
    );

    const img = screen.getByRole('img', { name: 'Luna Lovegood' });
    expect(img).toHaveAttribute('src', 'https://example.com/luna.jpg');
  });

  test('falls back to anonymous image on load error', async () => {
    renderWithStore(
      <CharacterCard character={mockLunaCharacter} currentPage={1} />
    );

    const img = screen.getByRole('img', { name: 'Luna Lovegood' });
    fireEvent.error(img);

    await waitFor(() => {
      expect(img).toHaveAttribute('src', ANONYMOUS_IMAGE);
    });
  });

  test('renders house icon (img with alt text of house name)', () => {
    renderWithStore(
      <CharacterCard character={mockLunaCharacter} currentPage={1} />
    );

    const houseIcon = screen.getByAltText('Ravenclaw');

    expect(houseIcon).toBeInTheDocument();
    expect(houseIcon.closest('.trait-item')).toBeInTheDocument();
  });
});
