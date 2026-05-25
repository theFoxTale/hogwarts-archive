import { render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';

import { AboutFlag } from '../components';

const mockNavigate = vi.fn();

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

describe('AboutFlag', () => {
  test('navigates to /about when clicked', async () => {
    render(
      <MemoryRouter>
        <AboutFlag />
      </MemoryRouter>
    );

    const container = document.querySelector('.about-flag');
    expect(container).toBeInTheDocument();

    if (container) {
      await userEvent.click(container);
      expect(mockNavigate).toHaveBeenCalledWith('/about');
    } else {
      throw new Error('AboutFlag container not found');
    }
  });
});
