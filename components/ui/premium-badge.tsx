'use client';

interface PremiumBadgeProps {
  text: string;
  variant?: 'default' | 'success' | 'warning' | 'danger' | 'info' | 'slate';
  size?: 'sm' | 'md';
  className?: string;
}

const variantStyles = {
  default: 'bg-blue-100 text-blue-700 border border-blue-300',
  success: 'bg-green-100 text-green-700 border border-green-300',
  warning: 'bg-amber-100 text-amber-700 border border-amber-300',
  danger: 'bg-red-100 text-red-700 border border-red-300',
  info: 'bg-cyan-100 text-cyan-700 border border-cyan-300',
  slate: 'bg-slate-100 text-slate-700 border border-slate-300',
};

const sizeStyles = {
  sm: 'px-2 py-1 text-xs font-medium',
  md: 'px-3 py-1.5 text-sm font-medium',
};

export function PremiumBadge({
  text,
  variant = 'default',
  size = 'sm',
  className = '',
}: PremiumBadgeProps) {
  return (
    <span className={`inline-block rounded-full ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}>
      {text}
    </span>
  );
}
