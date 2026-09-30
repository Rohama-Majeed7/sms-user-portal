import React from 'react';
import { Check } from 'lucide-react';
import type { PasswordValidationRules } from '../../utils/validation';

interface PasswordRequirementsProps {
  rules: PasswordValidationRules;
  showAlways?: boolean;
  value?: string;
}

export const PasswordRequirements: React.FC<PasswordRequirementsProps> = ({
  rules,
  showAlways = false,
  value = '',
}) => {
  if (!showAlways && !value) return null;

  const criteria = [
    { label: 'At least 8 characters', met: rules.minLength },
    { label: 'One uppercase letter (A-Z)', met: rules.hasUpper },
    { label: 'One lowercase letter (a-z)', met: rules.hasLower },
    { label: 'One number (0-9)', met: rules.hasNumber },
    { label: 'One special character (!@#$...)', met: rules.hasSpecial },
  ];

  return (
    <div className="mt-2 p-3 rounded-xl bg-slate-50 border border-slate-200/70 text-xs">
      <p className="font-semibold text-slate-700 mb-2">Password must contain:</p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
        {criteria.map((item) => (
          <div
            key={item.label}
            className={`flex items-center gap-1.5 transition-colors ${
              item.met ? 'text-emerald-600 font-medium' : 'text-slate-400'
            }`}
          >
            {item.met ? (
              <Check className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
            ) : (
              <span className="h-3.5 w-3.5 rounded-full border border-slate-300 flex items-center justify-center shrink-0">
                <span className="h-1 w-1 rounded-full bg-slate-300" />
              </span>
            )}
            <span>{item.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PasswordRequirements;
