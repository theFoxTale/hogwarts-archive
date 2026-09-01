import { fireEvent, screen } from '@testing-library/react';
import { vi } from 'vitest';

import ErrorPage from '../app/[locale]/error';

import { renderWithProviders } from './utils/test-utils';

describe('locale error page', () => {
  test('renders fallback copy and calls reset', () => {
    const reset = vi.fn();
    const consoleError = vi
      .spyOn(console, 'error')
      .mockImplementation(() => {});

    renderWithProviders(<ErrorPage error={new Error('boom')} reset={reset} />);

    expect(screen.getByText('A charm went wrong')).toBeInTheDocument();
    expect(
      screen.getByRole('link', { name: '← Return to Archive' })
    ).toHaveAttribute('href', '/');

    fireEvent.click(screen.getByRole('button', { name: 'Try again' }));
    expect(reset).toHaveBeenCalledTimes(1);

    consoleError.mockRestore();
  });
});
