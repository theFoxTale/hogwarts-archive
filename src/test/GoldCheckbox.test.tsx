import { render, screen, fireEvent } from '@testing-library/react';
import { GoldCheckbox } from '@ui';
import userEvent from '@testing-library/user-event';

describe('GoldCheckbox', () => {
  test('calls onChange with correct value and stops propagation', () => {
    const onChange = vi.fn();
    const onClickParent = vi.fn();

    render(
      <div onClick={onClickParent}>
        <GoldCheckbox checked={false} onChange={onChange} />
      </div>
    );

    const checkbox = screen.getByRole('checkbox');
    fireEvent.click(checkbox);

    expect(onChange).toHaveBeenCalledWith(true);
    expect(onClickParent).not.toHaveBeenCalled();
  });

  test('disabled checkbox does not trigger onChange', async () => {
    const onChange = vi.fn();
    render(<GoldCheckbox checked={false} onChange={onChange} disabled />);

    const checkbox = screen.getByRole('checkbox');
    await userEvent.click(checkbox);

    expect(onChange).not.toHaveBeenCalled();
  });
});
