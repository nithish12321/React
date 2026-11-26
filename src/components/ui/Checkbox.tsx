import { forwardRef, type InputHTMLAttributes } from 'react';
import { Check, Minus } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { InputSize } from './Input';

export interface CheckboxProps extends Omit<
  InputHTMLAttributes<HTMLInputElement>,
  'size' | 'onChange'
> {
  label?: string;
  helperText?: string;
  errorText?: string;
  indeterminate?: boolean;
  size?: InputSize;
  onChange?: (checked: boolean) => void;
}

const sizeClasses: Record<InputSize, { box: string; icon: string; text: string }> = {
  sm: { box: 'h-3.5 w-3.5 rounded', icon: 'h-2.5 w-2.5', text: 'text-xs' },
  md: { box: 'h-4 w-4 rounded', icon: 'h-3 w-3', text: 'text-sm' },
  lg: { box: 'h-5 w-5 rounded-md', icon: 'h-3.5 w-3.5', text: 'text-base' },
};

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(function Checkbox(
  {
    className,
    label,
    helperText,
    errorText,
    checked = false,
    indeterminate = false,
    disabled = false,
    size = 'md',
    onChange,
    id,
    ...props
  },
  ref,
) {
  const checkboxId = (id ?? label) ? label?.toLowerCase().replace(/\s+/g, '-') : undefined;
  const currentSize = sizeClasses[size];

  return (
    <div className="flex flex-col gap-1">
      <label
        htmlFor={checkboxId}
        className={cn(
          'inline-flex items-start gap-2.5 select-none cursor-pointer',
          disabled && 'opacity-50 cursor-not-allowed',
        )}
      >
        <div className="relative flex items-center pt-0.5">
          <input
            ref={ref}
            id={checkboxId}
            type="checkbox"
            checked={checked}
            disabled={disabled}
            onChange={(e) => onChange?.(e.target.checked)}
            className="sr-only peer"
            {...props}
          />
          <div
            className={cn(
              'flex items-center justify-center border border-border bg-surface transition-all shadow-soft',
              'peer-focus-visible:ring-2 peer-focus-visible:ring-ring peer-focus-visible:border-primary',
              (checked || indeterminate) && 'bg-primary border-primary text-primary-fg',
              errorText && 'border-danger',
              currentSize.box,
              className,
            )}
          >
            {indeterminate ? (
              <Minus className={cn('text-current stroke-[3]', currentSize.icon)} />
            ) : checked ? (
              <Check className={cn('text-current stroke-[3]', currentSize.icon)} />
            ) : null}
          </div>
        </div>

        {label && (
          <div className="flex flex-col">
            <span className={cn('font-medium text-foreground', currentSize.text)}>{label}</span>
            {helperText && !errorText && (
              <span className="text-[11px] text-muted">{helperText}</span>
            )}
          </div>
        )}
      </label>

      {errorText && <p className="text-[11px] text-danger ps-6">{errorText}</p>}
    </div>
  );
});
