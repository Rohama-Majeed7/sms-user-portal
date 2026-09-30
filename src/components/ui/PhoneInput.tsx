import React, { forwardRef } from 'react';
import { Phone } from 'lucide-react';
import { Input, type InputProps } from './Input';
import { formatPakistaniPhone } from '../../utils/validation';

export interface PhoneInputProps
  extends Omit<InputProps, 'onChange' | 'value'> {
  value: string;
  onChange: (value: string) => void;
  persistPrefix?: boolean;
}

export const PhoneInput = forwardRef<HTMLInputElement, PhoneInputProps>(
  (
    {
      value,
      onChange,
      persistPrefix = true,
      label = 'Phone Number',
      placeholder = '+923001234567',
      leftIcon,
      error,
      helperText,
      ...props
    },
    ref
  ) => {
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const raw = e.target.value;
      if (persistPrefix) {
        if (!raw || raw === '+' || raw === '+9') {
          onChange('+92');
          return;
        }
        onChange(formatPakistaniPhone(raw));
      } else {
        onChange(raw);
      }
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (persistPrefix) {
        const input = e.currentTarget;
        const selectionStart = input.selectionStart || 0;
        const selectionEnd = input.selectionEnd || 0;

        // Prevent backspacing or deleting the "+92" prefix
        if (
          (e.key === 'Backspace' && selectionStart <= 3 && selectionEnd <= 3) ||
          (e.key === 'Delete' && selectionStart < 3)
        ) {
          e.preventDefault();
        }
      }
      props.onKeyDown?.(e);
    };

    const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
      if (persistPrefix && (!value || value.trim() === '')) {
        onChange('+92');
      }
      props.onFocus?.(e);
    };

    return (
      <Input
        ref={ref}
        type="tel"
        inputMode="tel"
        label={label}
        value={value}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        onFocus={handleFocus}
        placeholder={placeholder}
        maxLength={13}
        leftIcon={leftIcon ?? <Phone className="h-4 w-4" />}
        error={error}
        helperText={helperText}
        {...props}
      />
    );
  }
);

PhoneInput.displayName = 'PhoneInput';
export default PhoneInput;
