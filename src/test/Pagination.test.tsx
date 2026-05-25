import { vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { Pagination } from '../components';

describe('Pagination tests', () => {
  const mockOnPrev = vi.fn();
  const mockOnNext = vi.fn();

  beforeEach(() => {
    mockOnPrev.mockClear();
    mockOnNext.mockClear();
  });

  test('displays current page and total pages', () => {
    render(
      <Pagination
        currentPage={3}
        totalPages={10}
        isPrevAvailable={true}
        isNextAvailable={true}
        onPrev={mockOnPrev}
        onNext={mockOnNext}
      />
    );
    expect(screen.getByText('Page 3 of 10')).toBeInTheDocument();
  });

  test('disables "Previous" button when isPrevAvailable is false', () => {
    render(
      <Pagination
        currentPage={1}
        totalPages={10}
        isPrevAvailable={false}
        isNextAvailable={true}
        onPrev={mockOnPrev}
        onNext={mockOnNext}
      />
    );
    const prevButton = screen.getByRole('button', { name: /previous/i });
    expect(prevButton).toBeDisabled();
  });

  test('disables "Next" button when isNextAvailable is false', () => {
    render(
      <Pagination
        currentPage={10}
        totalPages={10}
        isPrevAvailable={true}
        isNextAvailable={false}
        onPrev={mockOnPrev}
        onNext={mockOnNext}
      />
    );
    const nextButton = screen.getByRole('button', { name: /next/i });
    expect(nextButton).toBeDisabled();
  });

  test('calls onPrev when "Previous" button clicked and enabled', async () => {
    render(
      <Pagination
        currentPage={2}
        totalPages={10}
        isPrevAvailable={true}
        isNextAvailable={true}
        onPrev={mockOnPrev}
        onNext={mockOnNext}
      />
    );
    await userEvent.click(screen.getByRole('button', { name: /previous/i }));
    expect(mockOnPrev).toHaveBeenCalledTimes(1);
  });

  test('calls onNext when "Next" button clicked and enabled', async () => {
    render(
      <Pagination
        currentPage={2}
        totalPages={10}
        isPrevAvailable={true}
        isNextAvailable={true}
        onPrev={mockOnPrev}
        onNext={mockOnNext}
      />
    );
    await userEvent.click(screen.getByRole('button', { name: /next/i }));
    expect(mockOnNext).toHaveBeenCalledTimes(1);
  });
});
