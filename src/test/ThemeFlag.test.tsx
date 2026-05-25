import { render, screen, fireEvent } from '@testing-library/react';
import { ThemeProvider, useTheme } from '../contexts';
import { ThemeFlag } from '../components';

const TestComponent = () => {
  const { theme, toggleTheme } = useTheme();
  return (
    <div>
      <span data-testid="theme">{theme}</span>
      <button onClick={toggleTheme}>Toggle</button>
    </div>
  );
};

describe('ThemeContext', () => {
  beforeEach(() => {
    localStorage.clear();
    document.documentElement.removeAttribute('data-theme');
  });

  test('provides default theme based on system preference', () => {
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: vi.fn().mockImplementation((query) => ({
        matches: query !== '(prefers-color-scheme: dark)',
      })),
    });

    render(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>
    );

    expect(screen.getByTestId('theme').textContent).toBe('light');
  });

  test('saves theme to localStorage and sets data-theme attribute', () => {
    render(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>
    );

    fireEvent.click(screen.getByText('Toggle'));

    expect(localStorage.getItem('hogwarts-theme')).toBe('dark');
    expect(document.documentElement.getAttribute('data-theme')).toBe('dark');
  });

  test('ThemeFlag toggles theme on click', () => {
    render(
      <ThemeProvider>
        <ThemeFlag />
        <TestComponent />
      </ThemeProvider>
    );

    fireEvent.click(
      screen.getByRole('img', { hidden: true }) || screen.getByText('LIGHT')
    );

    expect(screen.getByTestId('theme').textContent).toBe('dark');
  });
});
