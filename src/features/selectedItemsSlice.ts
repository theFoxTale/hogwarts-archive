import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { Character } from '../api';

export interface SelectedItemsState {
  [id: string]: Character;
}

const initialState: SelectedItemsState = {};

const selectedItemsSlice = createSlice({
  name: 'selectedItems',
  initialState,
  reducers: {
    toggleSelect(state, action: PayloadAction<Character>) {
      const character = action.payload;
      if (state[character.id]) {
        delete state[character.id];
      } else {
        state[character.id] = character;
      }
    },
    clearAll() {
      return {};
    },
  },
});

export const { toggleSelect, clearAll } = selectedItemsSlice.actions;
export default selectedItemsSlice.reducer;

// Селекторы
export const selectSelectedItems = (state: {
  selectedItems: SelectedItemsState;
}) => state.selectedItems;

export const selectSelectedItemsArray = (state: {
  selectedItems: SelectedItemsState;
}) => Object.values(state.selectedItems);

export const selectSelectedCount = (state: {
  selectedItems: SelectedItemsState;
}) => Object.keys(state.selectedItems).length;

export const selectIsSelected =
  (id: string) => (state: { selectedItems: SelectedItemsState }) =>
    !!state.selectedItems[id];
export class selectedItemsReducer {}
