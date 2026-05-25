import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';
import { configureStore } from '@reduxjs/toolkit';
import { render, screen, fireEvent } from '@testing-library/react';

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

  test('renders character name and fields', () => {
    renderWithStore(
      <CharacterCard character={mockLunaCharacter} currentPage={1} />
    );
    expect(screen.getByText('Luna Lovegood')).toBeInTheDocument();
    expect(screen.getByText('Human')).toBeInTheDocument();
    expect(screen.getByText('Female')).toBeInTheDocument();
    expect(screen.getByAltText('Ravenclaw')).toBeInTheDocument();
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
    expect(screen.getByText('Unknown')).toBeInTheDocument();
    expect(screen.getByAltText('house')).toBeInTheDocument();
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

  //TODO: return image in character card
  test.skip('uses anonymous image when image is null', () => {
    // renderWithRouter(
    //   <CharacterCard character={mockCharacter} currentPage={1} />
    // );
    // const img: HTMLImageElement = screen.getByAltText('Luna Lovegood');
    // expect(img.src).toContain(ANONYMOUS_IMAGE);
  });

  test.skip('uses provided image when available', () => {
    // const withImage = {
    //   ...mockCharacter,
    //   image: 'https://example.com/luna.jpg',
    // };
    // renderWithRouter(<CharacterCard character={withImage} currentPage={1} />);
    // const img: HTMLImageElement = screen.getByAltText('Luna Lovegood');
    // expect(img.src).toBe('https://example.com/luna.jpg');
  });

  test.skip('uses anonymous image when image loading fails', () => {
    renderWithStore(
      <CharacterCard character={mockLunaCharacter} currentPage={1} />
    );
    const img = screen.getByAltText('Luna Lovegood') as HTMLImageElement;
    expect(img.src).toContain(ANONYMOUS_IMAGE);
  });
});
