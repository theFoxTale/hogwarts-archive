import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';

import { ThemeProvider } from '@contexts';
import { AboutPage, ABOUT_PAGE_STRINGS } from '@pages';

describe('AboutPage', () => {
  test('About Page renders without crashing and displays content', () => {
    render(
      <ThemeProvider>
        <MemoryRouter>
          <AboutPage />
        </MemoryRouter>
      </ThemeProvider>
    );

    expect(
      screen.getByText(ABOUT_PAGE_STRINGS.ABOUT_HEADER)
    ).toBeInTheDocument();
  });
});
