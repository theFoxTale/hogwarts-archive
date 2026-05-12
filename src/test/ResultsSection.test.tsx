import { render, screen } from '@testing-library/react';
import { ERROR_MESSAGES, UI_MESSAGES } from '../constants';
import { ResultsSection } from '../components';
import { mockCharacters } from './mocks/api';

describe('ResultsSection tests', () => {
  test('shows loading indicator when isLoading is true', () => {
    render(<ResultsSection results={[]} isLoading={true} error={null} />);
    expect(screen.getByText(UI_MESSAGES.LOADING)).toBeInTheDocument();
  });

  test('shows error message when error prop is provided', () => {
    render(
      <ResultsSection results={[]} isLoading={false} error="Network error" />
    );
    expect(screen.getByText('Network error')).toBeInTheDocument();
  });

  test('does not show error or no-results messages when loading', () => {
    render(<ResultsSection results={[]} isLoading={true} error="Some error" />);

    expect(screen.getByText(UI_MESSAGES.LOADING)).toBeInTheDocument();
    expect(screen.queryByText('Some error')).not.toBeInTheDocument();
    expect(screen.queryByText(UI_MESSAGES.NO_RESULTS)).not.toBeInTheDocument();
  });

  test('shows no results message when results array is empty', () => {
    render(<ResultsSection results={[]} isLoading={false} error={null} />);
    expect(screen.getByText(UI_MESSAGES.NO_RESULTS)).toBeInTheDocument();
  });

  test('renders list of characters when results are provided', () => {
    render(
      <ResultsSection results={mockCharacters} isLoading={false} error={null} />
    );
    expect(screen.getByText('Harry Potter')).toBeInTheDocument();
    expect(screen.getByText('Hermione Granger')).toBeInTheDocument();
  });

  test('does not throw error on initial render when shouldThrowError is true', () => {
    const spy = vi.spyOn(console, 'error').mockImplementation(() => {});

    expect(() => {
      render(
        <ResultsSection
          results={[]}
          isLoading={false}
          error={null}
          shouldThrowError={true}
        />
      );
    }).not.toThrow();

    spy.mockRestore();
  });

  test('throws error when shouldThrowError changes from false to true', () => {
    const spy = vi.spyOn(console, 'error').mockImplementation(() => {});

    const { rerender } = render(
      <ResultsSection
        results={[]}
        isLoading={false}
        error={null}
        shouldThrowError={false}
      />
    );

    expect(() => {
      rerender(
        <ResultsSection
          results={[]}
          isLoading={false}
          error={null}
          shouldThrowError={true}
        />
      );
    }).toThrow(ERROR_MESSAGES.TEST);

    spy.mockRestore();
  });

  test('does not throw again if shouldThrowError remains true after rerender', () => {
    const spy = vi.spyOn(console, 'error').mockImplementation(() => {});

    const { rerender } = render(
      <ResultsSection
        results={[]}
        isLoading={false}
        error={null}
        shouldThrowError={true}
      />
    );

    expect(() => {
      rerender(
        <ResultsSection
          results={[]}
          isLoading={false}
          error={null}
          shouldThrowError={true}
        />
      );
    }).not.toThrow();

    spy.mockRestore();
  });

  test('does not throw error when isLoading is true even if shouldThrowError becomes true', () => {
    const spy = vi.spyOn(console, 'error').mockImplementation(() => {});

    const { rerender } = render(
      <ResultsSection
        results={[]}
        isLoading={true}
        error={null}
        shouldThrowError={false}
      />
    );

    expect(() => {
      rerender(
        <ResultsSection
          results={[]}
          isLoading={true}
          error={null}
          shouldThrowError={true}
        />
      );
    }).not.toThrow();

    spy.mockRestore();
  });
});
