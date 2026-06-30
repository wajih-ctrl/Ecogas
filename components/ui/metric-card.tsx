'use client';

import { LucideIcon } from 'lucide-react';

interface MetricCardProps {
  label: string;
  value: string | number;
  icon: LucideIcon;
  trend?: { value: number; isPositive: boolean };
  onClick?: () => void;
  variant?: 'default' | 'success' | 'warning' | 'danger' | 'info';
  helpText?: string;
}

const variantStyles = {
  default: 'bg-white border-slate-200 text-slate-700',
  success: 'bg-white border-emerald-200 text-emerald-700',
  warning: 'bg-white border-amber-200 text-amber-700',
  danger: 'bg-white border-rose-200 text-rose-700',
  info: 'bg-white border-sky-200 text-sky-700',
};

const iconBgStyles = {
  default: 'bg-slate-100 text-slate-700',
  success: 'bg-emerald-50 text-emerald-700',
  warning: 'bg-amber-50 text-amber-700',
  danger: 'bg-rose-50 text-rose-700',
  info: 'bg-sky-50 text-sky-700',
};

export function MetricCard({
  label,
  value,
  icon: Icon,
  trend,
  onClick,
  variant = 'default',
  helpText,
}: MetricCardProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={!onClick}
      className={`w-full p-5 rounded-2xl border text-left transition-all shadow-[0_10px_30px_rgba(15,23,42,0.045)] ${variantStyles[variant]} ${
        onClick ? 'cursor-pointer hover:-translate-y-0.5 hover:shadow-[0_18px_45px_rgba(15,23,42,0.08)] hover:border-emerald-300' : 'cursor-default'
      }`}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1 text-left">
          <p className="text-xs font-bold uppercase tracking-[0.08em] text-slate-500 mb-2">{label}</p>
          <p className="text-3xl font-bold text-slate-950 mb-2">{value}</p>
          {trend && (
            <p className={`text-xs font-semibold ${trend.isPositive ? 'text-green-600' : 'text-red-600'}`}>
              {trend.isPositive ? '↑' : '↓'} {Math.abs(trend.value)}% this month
            </p>
          )}
          {helpText && <p className="text-xs text-slate-600 mt-2 leading-relaxed">{helpText}</p>}
        </div>
        <div className={`p-3 rounded-xl ${iconBgStyles[variant]}`}>
          <Icon className="w-6 h-6" />
        </div>
      </div>
    </button>
  );
}
