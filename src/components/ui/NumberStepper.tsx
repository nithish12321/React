import { Minus, Plus } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface NumberStepperProps {
  label?: string;
  helperText?: string;
  value: number;
  onChange: (val: number) => void;
  min?: number;
  max?: number;
  step?: number;
  disabled?: boolean;
  className?: string;
}

export function NumberStepper({
  label,
  helperText,
  value,
  onChange,
  min = 0,
  max = 100,
  step = 1,
  disabled = false,
  className,
}: NumberStepperProps) {
  const handleDec = () => {
    if (value - step >= min) onChange(value - step);
  };

  const handleInc = () => {
    if (value + step <= max) onChange(value + step);
  };

  return (
    <div className={cn('flex flex-col gap-1', className)}>
      {label && <label className="text-xs font-medium text-foreground">{label}</label>}

      <div
        className={cn(
          'inline-flex items-center rounded-md border border-border bg-surface shadow-soft overflow-hidden h-9 w-fit',
          disabled && 'opacity-50 cursor-not-allowed bg-muted-surface',
        )}
      >
        <button
          type="button"
          disabled={disabled || value <= min}
          onClick={handleDec}
          className="flex h-full w-8 items-center justify-center border-e border-border text-muted hover:bg-muted-surface hover:text-foreground disabled:opacity-50 disabled:pointer-events-none"
          aria-label="Decrement"
        >
          <Minus className="h-3.5 w-3.5" />
        </button>

        <span className="flex min-w-[48px] items-center justify-center px-2 font-mono text-xs font-semibold text-foreground select-none">
          {value}
        </span>

        <button
          type="button"
          disabled={disabled || value >= max}
          onClick={handleInc}
          className="flex h-full w-8 items-center justify-center border-s border-border text-muted hover:bg-muted-surface hover:text-foreground disabled:opacity-50 disabled:pointer-events-none"
          aria-label="Increment"
        >
          <Plus className="h-3.5 w-3.5" />
        </button>
      </div>

      {helperText && <p className="text-[11px] text-muted">{helperText}</p>}
    </div>
  );
}
