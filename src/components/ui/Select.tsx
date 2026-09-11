import React from 'react';
import { ChevronDown } from 'lucide-react';

export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  helperText?: string;
  leftIcon?: React.ReactNode;
  containerClassName?: string;
}

export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  (
    {
      label,
      error,
      helperText,
      leftIcon,
      id,
      className = '',
      containerClassName = '',
      children,
      disabled,
      ...props
    },
    ref
  ) => {
    const selectId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

    return (
      <div className={`w-full ${containerClassName}`}>
        {label && (
          <label
            htmlFor={selectId}
            className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5"
          >
            {label}
          </label>
        )}

        <div className="relative flex items-center">
          {leftIcon && (
            <div className="pointer-events-none absolute left-3.5 flex items-center justify-center text-slate-400">
              {leftIcon}
            </div>
          )}

          <select
            ref={ref}
            id={selectId}
            disabled={disabled}
            className={`w-full h-11 bg-white text-slate-900 text-sm rounded-xl border appearance-none cursor-pointer transition-all duration-150 outline-none
              ${leftIcon ? 'pl-10' : 'pl-3.5'}
              pr-10
              ${
                error
                  ? 'border-red-300 focus:border-red-500 focus:ring-3 focus:ring-red-500/15'
                  : 'border-slate-200 hover:border-slate-300 focus:border-indigo-600 focus:ring-3 focus:ring-indigo-500/15'
              }
              disabled:bg-slate-50 disabled:text-slate-500 disabled:border-slate-200 disabled:cursor-not-allowed
              ${className}`}
            {...props}
          >
            {children}
          </select>

          <ChevronDown className="pointer-events-none absolute right-3.5 h-4 w-4 text-slate-400" />
        </div>

        {error ? (
          <p className="mt-1.5 text-xs text-red-600 font-medium">{error}</p>
        ) : helperText ? (
          <p className="mt-1.5 text-xs text-slate-500">{helperText}</p>
        ) : null}
      </div>
    );
  }
);

Select.displayName = 'Select';
export default Select;
