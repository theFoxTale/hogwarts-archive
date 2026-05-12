import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ErrorButton } from '../components';

describe('ErrorButton tests', () => {
  test('renders button and calls onSimulateError on click', async () => {
    const mockSimulate = vi.fn();
    render(<ErrorButton onSimulateError={mockSimulate} />);

    const button = screen.getByRole('button');
    await userEvent.click(button);

    expect(mockSimulate).toHaveBeenCalledTimes(1);
  });
});
