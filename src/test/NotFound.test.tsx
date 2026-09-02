import { screen } from '@testing-library/react';
import { vi } from 'vitest';

import { NotFound } from '@views';
import { renderWithProviders } from './utils/test-utils';

import enMessages from '../../messages/en.json';

vi.mock('next-intl/server', () => ({
  getTranslations: async (namespace: keyof typeof enMessages) => {
    const group = enMessages[namespace] as Record<string, string>;
    return (key: string) => group[key] ?? key;
  },
}));

describe('NotFound', () => {
  test('renders 404 copy and a link home', async () => {
    renderWithProviders(await NotFound());

    expect(screen.getByText('404')).toBeInTheDocument();
    expect(screen.getByText('Page not found')).toBeInTheDocument();
    expect(
      screen.getByText('Lost? Even the best wizards need a map sometimes...')
    ).toBeInTheDocument();
    expect(screen.getByRole('link')).toHaveAttribute('href', '/');
  });
});
