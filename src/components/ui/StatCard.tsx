import React from 'react';

export interface StatCardProps {
  label: string;
  value: string | number;
  subtext?: string;
  icon: React.ReactNode;
  iconColor?: string;
  iconBg?: string;
  badge?: React.ReactNode;
  className?: string;
}

export const StatCard: React.FC<StatCardProps> = ({
  label,
  value,
  subtext,
  icon,
  iconColor = 'text-indigo-600',
  iconBg = 'bg-indigo-50',
  badge,
  className = '',
}) => {
  return (
    <div
      className={`bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs transition-all duration-200 hover:border-slate-300 hover:shadow-sm ${className}`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${iconBg} ${iconColor}`}>
          {icon}
        </div>
        {badge && <div>{badge}</div>}
      </div>

      <div className="mt-4">
        <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider truncate">
          {label}
        </p>
        <p className="mt-1 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
          {value}
        </p>
        {subtext && (
          <p className="mt-1.5 text-xs text-slate-500 truncate">
            {subtext}
          </p>
        )}
      </div>
    </div>
  );
};

export default StatCard;
