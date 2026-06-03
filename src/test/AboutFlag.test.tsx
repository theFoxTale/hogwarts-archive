import { fireEvent } from '@testing-library/react';

import { renderWithProviders } from './utils/test-utils.tsx';
import { AboutFlag } from '@features';

const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return { ...actual, useNavigate: () => mockNavigate };
});

describe('AboutFlag', () => {
  test('navigates to /about when clicked', () => {
    renderWithProviders(<AboutFlag />);

    const flag = document.querySelector('.about-flag') as HTMLElement;
    fireEvent.click(flag);

    expect(mockNavigate).toHaveBeenCalledWith('/about');
  });
});
