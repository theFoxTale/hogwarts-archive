import { render, screen } from '@testing-library/react';
import { FrameButton } from '@ui';
import { ThemeProvider } from '@contexts';

describe('FrameButton', () => {
  test('renders disabled button', () => {
    render(
      <ThemeProvider>
        <FrameButton onClick={() => {}} disabled={true}>
          Click
        </FrameButton>
      </ThemeProvider>
    );
    const button = screen.getByRole('button');
    expect(button).toBeDisabled();
  });
});
