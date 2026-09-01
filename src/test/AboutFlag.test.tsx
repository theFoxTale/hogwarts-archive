import { fireEvent } from '@testing-library/react';

import { renderWithProviders } from './utils/test-utils';
import { AboutFlag } from '@features';

const mockPush = vi.fn();
vi.mock('@/i18n/navigation', () => ({
  useRouter: () => ({ push: mockPush, replace: vi.fn() }),
  usePathname: () => '/',
}));

describe('AboutFlag', () => {
  test('navigates to /about when clicked', () => {
    renderWithProviders(<AboutFlag />);

    const flag = document.querySelector('.about-flag') as HTMLElement;
    fireEvent.click(flag);

    expect(mockPush).toHaveBeenCalledWith('/about');
  });
});
