import React from 'react';
import { AlertCircle, CheckCircle2, Info, AlertTriangle } from 'lucide-react';

export type AlertVariant = 'info' | 'success' | 'warning' | 'danger';

export interface AlertProps {
  variant?: AlertVariant;
  title?: string;
  message?: React.ReactNode;
  icon?: React.ReactNode;
  className?: string;
}

const variantConfig: Record<
  AlertVariant,
  { bg: string; border: string; text: string; defaultIcon: React.ReactNode }
> = {
  info: {
    bg: 'bg-sky-50',
    border: 'border-sky-200',
    text: 'text-sky-800',
    defaultIcon: <Info className="h-5 w-5 text-sky-600 shrink-0" />,
  },
  success: {
    bg: 'bg-emerald-50',
    border: 'border-emerald-200',
    text: 'text-emerald-800',
    defaultIcon: <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0" />,
  },
  warning: {
    bg: 'bg-amber-50',
    border: 'border-amber-200',
    text: 'text-amber-800',
    defaultIcon: <AlertTriangle className="h-5 w-5 text-amber-600 shrink-0" />,
  },
  danger: {
    bg: 'bg-red-50',
    border: 'border-red-200',
    text: 'text-red-800',
    defaultIcon: <AlertCircle className="h-5 w-5 text-red-600 shrink-0" />,
  },
};

export const Alert: React.FC<AlertProps> = ({
  variant = 'info',
  title,
  message,
  icon,
  className = '',
}) => {
  const config = variantConfig[variant];

  return (
    <div
      role="alert"
      className={`flex items-start gap-3 p-4 rounded-xl border ${config.bg} ${config.border} ${config.text} ${className}`}
    >
      {icon ? <span className="shrink-0">{icon}</span> : config.defaultIcon}
      <div className="flex-1 min-w-0 text-xs sm:text-sm leading-relaxed">
        {title && <p className="font-semibold mb-0.5">{title}</p>}
        <div>{message}</div>
      </div>
    </div>
  );
};

export default Alert;
