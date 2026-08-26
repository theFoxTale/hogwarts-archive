import { vi } from 'vitest';
import { screen } from '@testing-library/react';

import { ResultsSection } from '@features';

import { mockCharacters } from './mocks/api';
import { renderWithProviders } from './utils/test-utils.tsx';

const onSelectCharacter = vi.fn();

describe('ResultsSection', () => {
  test('shows loading indicator when isLoading is true', () => {
    renderWithProviders(
      <ResultsSection
        results={[]}
        isLoading={true}
        error={null}
        onSelectCharacter={onSelectCharacter}
      />
    );

    expect(screen.getByText('Loading magical beings...')).toBeInTheDocument();
  });

  test('shows error message when error prop is provided', () => {
    renderWithProviders(
      <ResultsSection
        results={[]}
        isLoading={false}
        error="Network error"
        onSelectCharacter={onSelectCharacter}
      />
    );

    expect(screen.getByText('Network error')).toBeInTheDocument();
  });

  test('does not show error or no-results messages when loading', () => {
    renderWithProviders(
      <ResultsSection
        results={[]}
        isLoading={true}
        error="Some error"
        onSelectCharacter={onSelectCharacter}
      />
    );

    expect(screen.getByText('Loading magical beings...')).toBeInTheDocument();
    expect(screen.queryByText('Some error')).not.toBeInTheDocument();
    expect(
      screen.queryByText(
        'No records in the magical archives. Try another name.'
      )
    ).not.toBeInTheDocument();
  });

  test('shows no results message when results array is empty', () => {
    renderWithProviders(
      <ResultsSection
        results={[]}
        isLoading={false}
        error={null}
        onSelectCharacter={onSelectCharacter}
      />
    );

    expect(
      screen.getByText('No records in the magical archives. Try another name.')
    ).toBeInTheDocument();
  });

  test('renders list of characters when results are provided', () => {
    renderWithProviders(
      <ResultsSection
        results={mockCharacters}
        isLoading={false}
        error={null}
        onSelectCharacter={onSelectCharacter}
      />
    );

    expect(screen.getByText('Harry Potter')).toBeInTheDocument();
    expect(screen.getByText('Hermione Granger')).toBeInTheDocument();
  });
});
