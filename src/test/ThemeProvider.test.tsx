import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { vi } from 'vitest';
import { ThemeProvider, useTheme } from '../contexts';

const TestComponent = () => {
  const { theme, toggleTheme } = useTheme();
  return (
    <div>
      <span data-testid="theme">{theme}</span>
      <button onClick={toggleTheme}>Toggle</button>
    </div>
  );
};

describe('ThemeProvider', () => {
  beforeEach(() => {
    localStorage.clear();
    document.documentElement.removeAttribute('data-theme');

    // Тема по умолчанию: светлая
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: vi.fn().mockImplementation((query) => ({
        matches: false,
        media: query,
        onchange: null,
        addListener: vi.fn(),
        removeListener: vi.fn(),
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn(),
      })),
    });
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  test('throws error when useTheme used outside provider', () => {
    const consoleError = vi
      .spyOn(console, 'error')
      .mockImplementation(() => {});
    expect(() => render(<TestComponent />)).toThrow(
      'useTheme must be used within a ThemeProvider'
    );
    consoleError.mockRestore();
  });

  test('initializes theme from localStorage if present', () => {
    localStorage.setItem('hogwarts-theme', 'dark');

    render(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>
    );

    expect(screen.getByTestId('theme').textContent).toBe('dark');
    expect(document.documentElement.getAttribute('data-theme')).toBe('dark');
  });

  test('initializes theme from system preference if no localStorage', () => {
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: vi.fn().mockImplementation((query) => ({
        matches: true,
        media: query,
        onchange: null,
        addListener: vi.fn(),
        removeListener: vi.fn(),
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn(),
      })),
    });

    render(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>
    );

    expect(screen.getByTestId('theme').textContent).toBe('dark');
  });

  test('toggles theme from light to dark and saves to localStorage', async () => {
    render(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>
    );
    expect(screen.getByTestId('theme').textContent).toBe('light');

    const button = screen.getByText('Toggle');
    await userEvent.click(button);

    await waitFor(() => {
      expect(screen.getByTestId('theme').textContent).toBe('dark');
    });
    expect(localStorage.getItem('hogwarts-theme')).toBe('dark');
    expect(document.documentElement.getAttribute('data-theme')).toBe('dark');
  });

  test('toggles theme from dark to light and saves to localStorage', async () => {
    localStorage.setItem('hogwarts-theme', 'dark');
    render(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>
    );
    expect(screen.getByTestId('theme').textContent).toBe('dark');

    const button = screen.getByText('Toggle');
    await userEvent.click(button);

    await waitFor(() => {
      expect(screen.getByTestId('theme').textContent).toBe('light');
    });
    expect(localStorage.getItem('hogwarts-theme')).toBe('light');
    expect(document.documentElement.getAttribute('data-theme')).toBe('light');
  });
});
