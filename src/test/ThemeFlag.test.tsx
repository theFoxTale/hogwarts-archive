import { fireEvent } from '@testing-library/react';

import { ThemeFlag } from '@features';
import { renderWithProviders } from './utils/test-utils';

describe('ThemeFlag', () => {
  test('toggles theme on click', () => {
    renderWithProviders(<ThemeFlag />);

    const flagContainer = document.querySelector('.theme-flag') as HTMLElement;
    fireEvent.click(flagContainer);

    expect(document.documentElement.getAttribute('data-theme')).toBe('dark');
  });
});
