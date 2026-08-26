import { fireEvent } from '@testing-library/react';

import { renderWithProviders } from './utils/test-utils.tsx';
import { AboutFlag } from '@features';

const mockPush = vi.fn();
vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: mockPush }),
}));

describe('AboutFlag', () => {
  test('navigates to /about when clicked', () => {
    renderWithProviders(<AboutFlag />);

    const flag = document.querySelector('.about-flag') as HTMLElement;
    fireEvent.click(flag);

    expect(mockPush).toHaveBeenCalledWith('/about');
  });
});
