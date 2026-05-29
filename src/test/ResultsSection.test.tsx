import { vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';

import { selectedItemsReducer } from '@store/slices';
import { RESULTS_STRING, ResultsSection } from '@layout';

import { mockCharacters } from './mocks/api';

const createEmptyStore = () =>
  configureStore({
    reducer: { selectedItems: selectedItemsReducer },
    preloadedState: { selectedItems: {} },
  });

describe('ResultsSection', () => {
  test('shows loading indicator when isLoading is true', () => {
    render(
      <MemoryRouter>
        <ResultsSection
          results={[]}
          isLoading={true}
          error={null}
          currentPage={1}
        />
      </MemoryRouter>
    );

    expect(screen.getByText(RESULTS_STRING.LOADING)).toBeInTheDocument();
  });

  test('shows error message when error prop is provided', () => {
    render(
      <MemoryRouter>
        <ResultsSection
          results={[]}
          isLoading={false}
          error="Network error"
          currentPage={1}
        />
      </MemoryRouter>
    );

    expect(screen.getByText('Network error')).toBeInTheDocument();
  });

  test('does not show error or no-results messages when loading', () => {
    render(
      <MemoryRouter>
        <ResultsSection
          results={[]}
          isLoading={true}
          error="Some error"
          currentPage={1}
        />
      </MemoryRouter>
    );

    expect(screen.getByText(RESULTS_STRING.LOADING)).toBeInTheDocument();
    expect(screen.queryByText('Some error')).not.toBeInTheDocument();
    expect(
      screen.queryByText(RESULTS_STRING.NO_RESULTS)
    ).not.toBeInTheDocument();
  });

  test('shows no results message when results array is empty', () => {
    render(
      <MemoryRouter>
        <ResultsSection
          results={[]}
          isLoading={false}
          error={null}
          currentPage={1}
        />
      </MemoryRouter>
    );

    expect(screen.getByText(RESULTS_STRING.NO_RESULTS)).toBeInTheDocument();
  });

  test('renders list of characters when results are provided', () => {
    render(
      <Provider store={createEmptyStore()}>
        <MemoryRouter>
          <ResultsSection
            results={mockCharacters}
            isLoading={false}
            error={null}
            currentPage={1}
          />
        </MemoryRouter>
      </Provider>
    );

    expect(screen.getByText('Harry Potter')).toBeInTheDocument();
    expect(screen.getByText('Hermione Granger')).toBeInTheDocument();
  });

  describe('error throwing behavior (shouldThrowError prop)', () => {
    let consoleErrorSpy: ReturnType<typeof vi.spyOn>;

    beforeEach(() => {
      consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    });

    afterEach(() => {
      consoleErrorSpy.mockRestore();
    });

    test('does not throw error on initial render when shouldThrowError is true', () => {
      expect(() => {
        render(
          <MemoryRouter>
            <ResultsSection
              results={[]}
              isLoading={false}
              error={null}
              shouldThrowError={true}
              currentPage={1}
            />
          </MemoryRouter>
        );
      }).not.toThrow();
    });

    test('throws error when shouldThrowError changes from false to true', () => {
      const { rerender } = render(
        <MemoryRouter>
          <ResultsSection
            results={[]}
            isLoading={false}
            error={null}
            shouldThrowError={false}
            currentPage={1}
          />
        </MemoryRouter>
      );

      expect(() => {
        rerender(
          <MemoryRouter>
            <ResultsSection
              results={[]}
              isLoading={false}
              error={null}
              shouldThrowError={true}
              currentPage={1}
            />
          </MemoryRouter>
        );
      }).toThrow(RESULTS_STRING.TEST_BUTTON);
    });

    test('does not throw again if shouldThrowError remains true after rerender', () => {
      const { rerender } = render(
        <MemoryRouter>
          <ResultsSection
            results={[]}
            isLoading={false}
            error={null}
            shouldThrowError={true}
            currentPage={1}
          />
        </MemoryRouter>
      );

      expect(() => {
        rerender(
          <MemoryRouter>
            <ResultsSection
              results={[]}
              isLoading={false}
              error={null}
              shouldThrowError={true}
              currentPage={1}
            />
          </MemoryRouter>
        );
      }).not.toThrow();
    });

    test('does not throw error when isLoading is true even if shouldThrowError becomes true', () => {
      const { rerender } = render(
        <MemoryRouter>
          <ResultsSection
            results={[]}
            isLoading={true}
            error={null}
            shouldThrowError={false}
            currentPage={1}
          />
        </MemoryRouter>
      );

      expect(() => {
        rerender(
          <MemoryRouter>
            <ResultsSection
              results={[]}
              isLoading={true}
              error={null}
              shouldThrowError={true}
              currentPage={1}
            />
          </MemoryRouter>
        );
      }).not.toThrow();
    });
  });
});
