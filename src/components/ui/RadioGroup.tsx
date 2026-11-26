import { cn } from '@/lib/utils';
import type { InputSize } from './Input';

export interface RadioOption {
  value: string;
  label: string;
  description?: string;
  disabled?: boolean;
}

export interface RadioGroupProps {
  name: string;
  label?: string;
  helperText?: string;
  errorText?: string;
  options: RadioOption[];
  value: string;
  onChange: (value: string) => void;
  orientation?: 'horizontal' | 'vertical';
  size?: InputSize;
  className?: string;
}

const sizeClasses: Record<InputSize, { circle: string; dot: string; text: string }> = {
  sm: { circle: 'h-3.5 w-3.5', dot: 'h-1.5 w-1.5', text: 'text-xs' },
  md: { circle: 'h-4 w-4', dot: 'h-2 w-2', text: 'text-sm' },
  lg: { circle: 'h-5 w-5', dot: 'h-2.5 w-2.5', text: 'text-base' },
};

export function RadioGroup({
  name,
  label,
  helperText,
  errorText,
  options,
  value,
  onChange,
  orientation = 'vertical',
  size = 'md',
  className,
}: RadioGroupProps) {
  const currentSize = sizeClasses[size];

  return (
    <div className={cn('flex flex-col gap-2', className)}>
      {label && <span className="text-xs font-medium text-foreground">{label}</span>}

      <div
        className={cn('flex gap-3', orientation === 'vertical' ? 'flex-col' : 'flex-row flex-wrap')}
      >
        {options.map((opt) => {
          const isSelected = value === opt.value;
          const optId = `${name}-${opt.value}`;
          return (
            <label
              key={opt.value}
              htmlFor={optId}
              className={cn(
                'inline-flex items-start gap-2.5 select-none cursor-pointer',
                opt.disabled && 'opacity-50 cursor-not-allowed',
              )}
            >
              <div className="relative flex items-center pt-0.5">
                <input
                  id={optId}
                  type="radio"
                  name={name}
                  value={opt.value}
                  checked={isSelected}
                  disabled={opt.disabled}
                  onChange={() => onChange(opt.value)}
                  className="sr-only peer"
                />
                <div
                  className={cn(
                    'flex items-center justify-center rounded-full border border-border bg-surface transition-all shadow-soft',
                    'peer-focus-visible:ring-2 peer-focus-visible:ring-ring peer-focus-visible:border-primary',
                    isSelected && 'border-primary',
                    currentSize.circle,
                  )}
                >
                  {isSelected && <div className={cn('rounded-full bg-primary', currentSize.dot)} />}
                </div>
              </div>

              <div className="flex flex-col">
                <span className={cn('font-medium text-foreground', currentSize.text)}>
                  {opt.label}
                </span>
                {opt.description && (
                  <span className="text-[11px] text-muted">{opt.description}</span>
                )}
              </div>
            </label>
          );
        })}
      </div>

      {errorText ? (
        <p className="text-[11px] text-danger">{errorText}</p>
      ) : helperText ? (
        <p className="text-[11px] text-muted">{helperText}</p>
      ) : null}
    </div>
  );
}
