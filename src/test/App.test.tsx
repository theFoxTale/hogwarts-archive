import { render, screen } from '@testing-library/react';

import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';

import selectedItemsReducer from '../features/selectedItemsSlice';
import { ThemeProvider } from '../contexts';
import { APP_STRINGS } from '../constants';

import { App } from '../App';

const createStore = () =>
  configureStore({
    reducer: { selectedItems: selectedItemsReducer },
    preloadedState: { selectedItems: {} },
  });

describe('App', () => {
  test('renders without crashing and shows header content', () => {
    render(
      <Provider store={createStore()}>
        <ThemeProvider>
          <App />
        </ThemeProvider>
      </Provider>
    );

    expect(screen.getByText(APP_STRINGS.APP_NAME)).toBeInTheDocument();
  });
});
