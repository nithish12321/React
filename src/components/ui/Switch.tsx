import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from 'react';
import { cn } from '@/lib/utils';
import type { InputSize } from './Input';

export interface SwitchProps extends Omit<
  ButtonHTMLAttributes<HTMLButtonElement>,
  'onChange' | 'size'
> {
  label?: string;
  description?: string;
  checked?: boolean;
  onChange?: (checked: boolean) => void;
  size?: InputSize;
  icon?: ReactNode;
}

const sizeClasses: Record<InputSize, { track: string; thumb: string; translate: string }> = {
  sm: { track: 'h-4 w-7', thumb: 'h-3 w-3', translate: 'translate-x-3' },
  md: { track: 'h-5 w-9', thumb: 'h-4 w-4', translate: 'translate-x-4' },
  lg: { track: 'h-6 w-11', thumb: 'h-5 w-5', translate: 'translate-x-5' },
};

export const Switch = forwardRef<HTMLButtonElement, SwitchProps>(function Switch(
  {
    className,
    label,
    description,
    checked = false,
    onChange,
    disabled = false,
    size = 'md',
    icon,
    id,
    ...props
  },
  ref,
) {
  const switchId = (id ?? label) ? label?.toLowerCase().replace(/\s+/g, '-') : undefined;
  const currentSize = sizeClasses[size];

  return (
    <div className="inline-flex items-center justify-between gap-3">
      {(label || description) && (
        <div className="flex flex-col">
          {label && (
            <label
              htmlFor={switchId}
              className={cn(
                'text-xs font-medium text-foreground cursor-pointer select-none',
                disabled && 'opacity-50 cursor-not-allowed',
              )}
            >
              {label}
            </label>
          )}
          {description && <span className="text-[11px] text-muted">{description}</span>}
        </div>
      )}

      <button
        ref={ref}
        id={switchId}
        type="button"
        role="switch"
        aria-checked={checked}
        disabled={disabled}
        onClick={() => onChange?.(!checked)}
        className={cn(
          'relative inline-flex shrink-0 items-center rounded-full border-2 border-transparent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer',
          checked ? 'bg-primary' : 'bg-muted-surface border border-border',
          currentSize.track,
          className,
        )}
        {...props}
      >
        <span
          className={cn(
            'pointer-events-none flex items-center justify-center rounded-full bg-surface shadow-soft transition-transform text-[8px]',
            checked ? currentSize.translate : 'translate-x-0',
            currentSize.thumb,
          )}
        >
          {icon}
        </span>
      </button>
    </div>
  );
});
