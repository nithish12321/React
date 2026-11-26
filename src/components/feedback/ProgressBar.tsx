import { cn } from '@/lib/utils';

export interface ProgressBarProps {
  value?: number; // 0 to 100
  max?: number;
  showValue?: boolean;
  striped?: boolean;
  indeterminate?: boolean;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'primary' | 'success' | 'warning' | 'danger';
  className?: string;
}

const heightClasses = {
  sm: 'h-1.5',
  md: 'h-2.5',
  lg: 'h-4',
};

const variantClasses = {
  primary: 'bg-primary',
  success: 'bg-success',
  warning: 'bg-warning',
  danger: 'bg-danger',
};

export function ProgressBar({
  value = 0,
  max = 100,
  showValue = false,
  indeterminate = false,
  size = 'md',
  variant = 'primary',
  className,
}: ProgressBarProps) {
  const percentage = Math.min(100, Math.max(0, (value / max) * 100));

  return (
    <div className={cn('w-full flex flex-col gap-1', className)}>
      <div
        role="progressbar"
        aria-valuenow={indeterminate ? undefined : value}
        aria-valuemax={max}
        className={cn(
          'relative w-full overflow-hidden rounded-full bg-muted-surface border border-border shadow-xs',
          heightClasses[size],
        )}
      >
        <div
          className={cn(
            'h-full rounded-full transition-all duration-300',
            variantClasses[variant],
            indeterminate && 'w-1/3 animate-[pulse_1.5s_infinite_ease-in-out]',
          )}
          style={{ width: indeterminate ? '40%' : `${percentage}%` }}
        />
      </div>

      {showValue && !indeterminate && (
        <div className="flex justify-end text-[10px] font-mono text-muted">
          {Math.round(percentage)}%
        </div>
      )}
    </div>
  );
}

export function CircularProgress({
  value = 65,
  size = 48,
  strokeWidth = 4,
  variant = 'primary',
  showValue = true,
}: {
  value?: number;
  size?: number;
  strokeWidth?: number;
  variant?: 'primary' | 'success' | 'warning' | 'danger';
  showValue?: boolean;
}) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (value / 100) * circumference;

  const strokeColor = {
    primary: 'var(--color-primary)',
    success: 'var(--color-success)',
    warning: 'var(--color-warning)',
    danger: 'var(--color-danger)',
  }[variant];

  return (
    <div
      className="relative inline-flex items-center justify-center"
      style={{ width: size, height: size }}
    >
      <svg className="rotate-[-90deg]" width={size} height={size}>
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="var(--color-border)"
          strokeWidth={strokeWidth}
          fill="transparent"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={strokeColor}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          fill="transparent"
          className="transition-all duration-500 ease-in-out"
        />
      </svg>
      {showValue && (
        <span className="absolute text-[11px] font-mono font-bold text-foreground">
          {Math.round(value)}%
        </span>
      )}
    </div>
  );
}
