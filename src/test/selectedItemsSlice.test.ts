import selectedItemsReducer, {
  toggleSelect,
  clearAll,
  selectSelectedItems,
  selectSelectedCount,
  selectIsSelected,
} from '../features/selectedItemsSlice';
import type { Character } from '../api';

const mockFirstCharacter: Character = {
  id: '1',
  name: 'Harry',
  house: null,
  species: null,
  gender: null,
  image: null,
};
const mockSecondCharacter: Character = {
  id: '2',
  name: 'Hermione',
  house: null,
  species: null,
  gender: null,
  image: null,
};

describe('selectedItemsSlice tests', () => {
  test('should add item on toggleSelect if not present', () => {
    const initialState = {};
    const newState = selectedItemsReducer(
      initialState,
      toggleSelect(mockFirstCharacter)
    );
    expect(newState).toEqual({ '1': mockFirstCharacter });
  });

  test('should remove item on toggleSelect if already present', () => {
    const initialState = { '1': mockFirstCharacter };
    const newState = selectedItemsReducer(
      initialState,
      toggleSelect(mockFirstCharacter)
    );
    expect(newState).toEqual({});
  });

  test('clearAll should reset state to empty', () => {
    const initialState = { '1': mockFirstCharacter, '2': mockSecondCharacter };
    const newState = selectedItemsReducer(initialState, clearAll());
    expect(newState).toEqual({});
  });

  test('selectSelectedItems returns full object', () => {
    const state = { selectedItems: { '1': mockFirstCharacter } };
    expect(selectSelectedItems(state)).toEqual({ '1': mockFirstCharacter });
  });

  test('selectSelectedCount returns number of items', () => {
    const state = {
      selectedItems: { '1': mockFirstCharacter, '2': mockSecondCharacter },
    };
    expect(selectSelectedCount(state)).toBe(2);
  });

  test('selectIsSelected returns true if id exists', () => {
    const state = { selectedItems: { '1': mockFirstCharacter } };
    expect(selectIsSelected('1')(state)).toBe(true);
    expect(selectIsSelected('2')(state)).toBe(false);
  });
});
