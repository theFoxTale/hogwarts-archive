import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useState } from 'react';
import { vi } from 'vitest';

import { SearchSection } from '../components';
import { UI_MESSAGES } from '../constants';

describe('SearchSection tests', () => {
  const mockOnSearch = vi.fn();

  function Wrapper() {
    const [value, setValue] = useState('');
    return (
      <SearchSection
        value={value}
        onChange={setValue}
        onSearch={mockOnSearch}
      />
    );
  }

  beforeEach(() => {
    mockOnSearch.mockClear();
  });

  test('renders input and button', () => {
    render(<Wrapper />);
    expect(
      screen.getByPlaceholderText(UI_MESSAGES.SEARCH_PLACEHOLDER)
    ).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: UI_MESSAGES.SEARCH_BUTTON_TEXT })
    ).toBeInTheDocument();
  });

  test('does not show clear button when input is empty', () => {
    render(<Wrapper />);
    expect(screen.queryByLabelText(/clear search/i)).not.toBeInTheDocument();
  });

  test('updates input value on user typing', async () => {
    render(<Wrapper />);
    const input = screen.getByPlaceholderText(UI_MESSAGES.SEARCH_PLACEHOLDER);
    await userEvent.type(input, 'Hermione');
    expect(input).toHaveValue('Hermione');
  });

  test('calls onSearch with trimmed value on button click', async () => {
    render(<Wrapper />);
    const input = screen.getByPlaceholderText(UI_MESSAGES.SEARCH_PLACEHOLDER);
    await userEvent.type(input, '  Hermione  ');
    expect(input).toHaveValue('  Hermione  ');

    const searchButton = screen.getByRole('button', {
      name: UI_MESSAGES.SEARCH_BUTTON_TEXT,
    });
    await userEvent.click(searchButton);

    expect(mockOnSearch).toHaveBeenCalledWith('Hermione');
  });

  test('calls onSearch with trimmed value on Enter key', async () => {
    render(<Wrapper />);
    const input = screen.getByPlaceholderText(UI_MESSAGES.SEARCH_PLACEHOLDER);
    await userEvent.type(input, '  Draco  {enter}');
    expect(mockOnSearch).toHaveBeenCalledWith('Draco');
  });

  test('clears input and calls onSearch with empty string when clear button clicked', async () => {
    render(<Wrapper />);
    const input = screen.getByPlaceholderText(UI_MESSAGES.SEARCH_PLACEHOLDER);
    await userEvent.type(input, 'Harry');
    expect(input).toHaveValue('Harry');

    const clearButton = screen.getByLabelText(/clear search/i);
    await userEvent.click(clearButton);

    expect(input).toHaveValue('');
    expect(mockOnSearch).toHaveBeenCalledWith('');
  });

  test('calls onSearch with empty string when input contains only spaces and Enter pressed', async () => {
    render(<Wrapper />);
    const input = screen.getByPlaceholderText(UI_MESSAGES.SEARCH_PLACEHOLDER);
    await userEvent.type(input, '     {enter}');
    expect(mockOnSearch).toHaveBeenCalledWith('');
  });

  test('calls onSearch with empty string when input contains only spaces and button clicked', async () => {
    render(<Wrapper />);
    const input = screen.getByPlaceholderText(UI_MESSAGES.SEARCH_PLACEHOLDER);
    await userEvent.type(input, '     ');
    const button = screen.getByRole('button', {
      name: UI_MESSAGES.SEARCH_BUTTON_TEXT,
    });
    await userEvent.click(button);
    expect(mockOnSearch).toHaveBeenCalledWith('');
  });
});
