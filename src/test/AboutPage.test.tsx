import { screen } from '@testing-library/react';
import { vi } from 'vitest';

import AboutPage from '../app/[locale]/about/page';
import { renderWithProviders } from './utils/test-utils';

import enMessages from '../../messages/en.json';

vi.mock('next-intl/server', () => ({
  setRequestLocale: vi.fn(),
  getTranslations: async (namespace: keyof typeof enMessages) => {
    const group = enMessages[namespace] as Record<string, string>;
    return (key: string) => group[key] ?? key;
  },
}));

describe('About page', () => {
  test('renders header and a link home', async () => {
    renderWithProviders(
      await AboutPage({ params: Promise.resolve({ locale: 'en' }) })
    );

    expect(screen.getByText('About Hogwarts Archive')).toBeInTheDocument();
    expect(
      screen.getByRole('link', { name: /RS School React/ })
    ).toHaveAttribute('href', 'https://rs.school/react/');
    expect(
      screen.getByRole('link', { name: /Annie theFoxTale/ })
    ).toHaveAttribute('href', 'https://github.com/theFoxTale');
    expect(
      screen
        .getAllByRole('link')
        .some((link) => link.getAttribute('href') === '/')
    ).toBe(true);
  });
});
