import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { SearchSection } from '../components';
import { UI_MESSAGES } from '../constants';

describe('SearchSection tests', () => {
  const mockOnSearch = vi.fn();

  beforeEach(() => {
    mockOnSearch.mockClear();
  });

  test('renders input and button', () => {
    render(<SearchSection onSearch={mockOnSearch} />);
    expect(
      screen.getByPlaceholderText(/search characters/i)
    ).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: UI_MESSAGES.SEARCH_BUTTON_TEXT })
    ).toBeInTheDocument();
  });

  test('does not show clear button when input is empty', () => {
    render(<SearchSection onSearch={mockOnSearch} />);
    const clearButton = screen.queryByLabelText(/clear search/i);
    expect(clearButton).not.toBeInTheDocument();
  });

  test('displays initial search text from prop', () => {
    render(<SearchSection onSearch={mockOnSearch} initialSearchText="Harry" />);
    const input: HTMLInputElement =
      screen.getByPlaceholderText(/search characters/i);
    expect(input.value).toBe('Harry');
  });

  test('updates input value on user typing', async () => {
    render(<SearchSection onSearch={mockOnSearch} />);
    const input = screen.getByPlaceholderText(/search characters/i);
    await userEvent.type(input, 'Ron');
    expect(input).toHaveValue('Ron');
  });

  test('calls onSearch with trimmed value on button click', async () => {
    render(<SearchSection onSearch={mockOnSearch} />);
    const input = screen.getByPlaceholderText(/search characters/i);
    await userEvent.type(input, '  Hermione  ');

    const button = screen.getByRole('button', {
      name: UI_MESSAGES.SEARCH_BUTTON_TEXT,
    });

    await userEvent.click(button);
    expect(mockOnSearch).toHaveBeenCalledWith('Hermione');
  });

  test('calls onSearch with trimmed value on Enter key', async () => {
    render(<SearchSection onSearch={mockOnSearch} />);
    const input = screen.getByPlaceholderText(/search characters/i);
    await userEvent.type(input, '  Draco  {enter}');
    expect(mockOnSearch).toHaveBeenCalledWith('Draco');
  });

  test('clears input and calls onSearch with empty string when clear button clicked', async () => {
    render(<SearchSection onSearch={mockOnSearch} initialSearchText="test" />);
    const clearButton = screen.getByLabelText(/clear search/i);
    await userEvent.click(clearButton);

    const input: HTMLInputElement =
      screen.getByPlaceholderText(/search characters/i);

    expect(input.value).toBe('');
    expect(mockOnSearch).toHaveBeenCalledWith('');
  });

  test('calls onSearch with empty string when input contains only spaces and Enter pressed', async () => {
    render(<SearchSection onSearch={mockOnSearch} />);
    const input = screen.getByPlaceholderText(/search characters/i);
    await userEvent.type(input, '     {enter}');
    expect(mockOnSearch).toHaveBeenCalledWith('');
  });

  test('calls onSearch with empty string when input contains only spaces and button clicked', async () => {
    render(<SearchSection onSearch={mockOnSearch} />);
    const input = screen.getByPlaceholderText(/search characters/i);
    await userEvent.type(input, '     ');

    const button = screen.getByRole('button', {
      name: UI_MESSAGES.SEARCH_BUTTON_TEXT,
    });
    await userEvent.click(button);

    expect(mockOnSearch).toHaveBeenCalledWith('');
  });
});
