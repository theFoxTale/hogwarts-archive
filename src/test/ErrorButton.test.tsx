import { vi } from 'vitest';
import { render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { ErrorFlag } from '@features';
import { ThemeProvider } from '@contexts';

describe('ErrorFlag', () => {
  test('renders flag and calls onSimulateError on click', async () => {
    const mockSimulate = vi.fn();

    render(
      <ThemeProvider>
        <ErrorFlag onSimulateError={mockSimulate} />
      </ThemeProvider>
    );

    const flagContainer = document.querySelector('.error-flag') as HTMLElement;
    expect(flagContainer).toBeInTheDocument();

    await userEvent.click(flagContainer);
    expect(mockSimulate).toHaveBeenCalledTimes(1);
  });
});
