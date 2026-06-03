import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { vi } from 'vitest';

import { ErrorBoundary, ERROR_BOUNDARY_STRINGS } from '@layout';

const MY_TEST_ERROR = 'Test error';

const ProblemChild = () => {
  throw new Error(MY_TEST_ERROR);
};

describe('ErrorBoundary', () => {
  /*
   В моём коде когда ErrorBoundary ловит ошибку, он вызывает componentDidCatch,
   который логирует ошибку в консоль через console.error.

   Если не замокать console.error, тесты будут засорять вывод консоли этими сообщениями, что вероятно нарушает п. 9 задания
   Поэтому я подменяю console.error на vi.fn(), чтобы он ничего не выводил, а после всех тестов восстанавливаю оригинальный метод
  */
  const originalError = console.error;
  beforeAll(() => {
    console.error = vi.fn();
  });
  afterAll(() => {
    console.error = originalError;
  });

  test('displays fallback UI when child throws', () => {
    render(
      <ErrorBoundary>
        <ProblemChild />
      </ErrorBoundary>
    );
    expect(
      screen.getByText(ERROR_BOUNDARY_STRINGS.FALLBACK_TITLE)
    ).toBeInTheDocument();
    expect(screen.getByText(MY_TEST_ERROR)).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: ERROR_BOUNDARY_STRINGS.TRY_AGAIN })
    ).toBeInTheDocument();
  });

  test('calls onReset when button in fallback UI is clicked', async () => {
    const onResetMock = vi.fn();
    render(
      <ErrorBoundary onReset={onResetMock}>
        <ProblemChild />
      </ErrorBoundary>
    );
    await userEvent.click(
      screen.getByRole('button', { name: ERROR_BOUNDARY_STRINGS.TRY_AGAIN })
    );
    expect(onResetMock).toHaveBeenCalledTimes(1);
  });
});
