import { fireEvent } from '@testing-library/react';

import { LanguageFlag } from '@features';

import { renderWithProviders } from './utils/test-utils';

const mockReplace = vi.fn();
vi.mock('@/i18n/navigation', () => ({
  useRouter: () => ({ push: vi.fn(), replace: mockReplace }),
  usePathname: () => '/about',
}));

describe('LanguageFlag', () => {
  test('switches locale via the current pathname', () => {
    renderWithProviders(<LanguageFlag />);

    const flag = document.querySelector('.language-flag') as HTMLElement;
    fireEvent.click(flag);

    expect(mockReplace).toHaveBeenCalledWith('/about', { locale: 'ru' });
  });
});
