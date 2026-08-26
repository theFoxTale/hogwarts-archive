import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useState } from 'react';
import { vi } from 'vitest';

import { SearchSection } from '@features';

import { renderWithProviders } from './utils/test-utils.tsx';

const SEARCH = {
  placeholder: 'Find magical records...',
  button: 'Accio',
  clear: 'Clear search',
  refresh: 'Clear cache & refresh search results',
};

describe('SearchSection', () => {
  const mockOnSearch = vi.fn();
  const mockOnRefresh = vi.fn();

  function Wrapper() {
    const [value, setValue] = useState('');
    return (
      <SearchSection
        value={value}
        onChange={setValue}
        onSearch={mockOnSearch}
        onRefresh={mockOnRefresh}
      />
    );
  }

  beforeEach(() => {
    vi.clearAllMocks();
  });

  test('renders input, search button, and refresh button', () => {
    renderWithProviders(<Wrapper />);
    expect(screen.getByPlaceholderText(SEARCH.placeholder)).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: new RegExp(SEARCH.button) })
    ).toBeInTheDocument();
    expect(screen.getByTitle(SEARCH.refresh)).toBeInTheDocument();
  });

  test('does not show clear button when input is empty', () => {
    renderWithProviders(<Wrapper />);
    expect(screen.queryByLabelText(SEARCH.clear)).not.toBeInTheDocument();
  });

  test('updates input value on user typing', async () => {
    renderWithProviders(<Wrapper />);
    const input = screen.getByPlaceholderText(SEARCH.placeholder);
    await userEvent.type(input, 'Hermione');
    expect(input).toHaveValue('Hermione');
  });

  test('calls onSearch with trimmed value on button click', async () => {
    renderWithProviders(<Wrapper />);
    const input = screen.getByPlaceholderText(SEARCH.placeholder);
    await userEvent.type(input, '  Hermione  ');
    expect(input).toHaveValue('  Hermione  ');

    await userEvent.click(
      screen.getByRole('button', { name: new RegExp(SEARCH.button) })
    );

    expect(mockOnSearch).toHaveBeenCalledWith('Hermione');
  });

  test('calls onSearch with trimmed value on Enter key', async () => {
    renderWithProviders(<Wrapper />);
    const input = screen.getByPlaceholderText(SEARCH.placeholder);
    await userEvent.type(input, '  Draco  {enter}');
    expect(mockOnSearch).toHaveBeenCalledWith('Draco');
  });

  test('clears input and calls onSearch with empty string when clear button clicked', async () => {
    renderWithProviders(<Wrapper />);
    const input = screen.getByPlaceholderText(SEARCH.placeholder);
    await userEvent.type(input, 'Harry');
    expect(input).toHaveValue('Harry');

    await userEvent.click(screen.getByLabelText(SEARCH.clear));

    expect(input).toHaveValue('');
    expect(mockOnSearch).toHaveBeenCalledWith('');
  });

  test('calls onSearch with empty string when input contains only spaces and Enter pressed', async () => {
    renderWithProviders(<Wrapper />);
    const input = screen.getByPlaceholderText(SEARCH.placeholder);
    await userEvent.type(input, '     {enter}');
    expect(mockOnSearch).toHaveBeenCalledWith('');
  });

  test('calls onSearch with empty string when input contains only spaces and button clicked', async () => {
    renderWithProviders(<Wrapper />);
    const input = screen.getByPlaceholderText(SEARCH.placeholder);
    await userEvent.type(input, '     ');
    await userEvent.click(
      screen.getByRole('button', { name: new RegExp(SEARCH.button) })
    );
    expect(mockOnSearch).toHaveBeenCalledWith('');
  });

  test('calls onRefresh when refresh button is clicked', async () => {
    renderWithProviders(<Wrapper />);
    await userEvent.click(screen.getByTitle(SEARCH.refresh));
    expect(mockOnRefresh).toHaveBeenCalledTimes(1);
  });
});
