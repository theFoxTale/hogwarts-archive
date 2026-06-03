import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';

import { ThemeProvider } from '@contexts';
import { NOT_FOUND_STRINGS, NotFoundPage } from '@pages';

describe('NotFoundPage', () => {
  test('renders without crashing and shows 404 message', () => {
    render(
      <ThemeProvider>
        <MemoryRouter>
          <NotFoundPage />
        </MemoryRouter>
      </ThemeProvider>
    );

    expect(screen.getByText(NOT_FOUND_STRINGS.MAIN_TITLE)).toBeInTheDocument();
    expect(screen.getByText(NOT_FOUND_STRINGS.SUB_TITLE)).toBeInTheDocument();
  });
});
