import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';

import { ThemeProvider } from '../contexts';
import { NotFoundPage } from '../pages';

describe('NotFoundPage', () => {
  test('renders without crashing and shows 404 message', () => {
    render(
      <ThemeProvider>
        <MemoryRouter>
          <NotFoundPage />
        </MemoryRouter>
      </ThemeProvider>
    );

    expect(screen.getByText(/404/i)).toBeInTheDocument();
  });
});
