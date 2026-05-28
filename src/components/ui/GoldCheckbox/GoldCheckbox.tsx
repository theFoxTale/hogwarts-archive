import { useId } from 'react';

import './GoldCheckbox.css';

interface GoldCheckboxProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  id?: string;
  disabled?: boolean;
}

export function GoldCheckbox({
  checked,
  onChange,
  id,
  disabled = false,
}: GoldCheckboxProps) {
  const generatedId = useId();
  const uniqueId = id || `gold-checkbox-${generatedId}`;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.stopPropagation();
    onChange(e.target.checked);
  };

  return (
    <div
      className={`gold-checkbox ${disabled ? 'gold-checkbox--disabled' : ''}`}
      onClick={(e) => e.stopPropagation()}
    >
      <input
        type="checkbox"
        id={uniqueId}
        checked={checked}
        onChange={handleChange}
        disabled={disabled}
      />
      <label htmlFor={uniqueId}></label>
    </div>
  );
}
