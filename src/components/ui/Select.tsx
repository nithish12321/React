import { useState, useRef, useEffect } from 'react';
import { ChevronDown, Check, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { InputDisplayState, InputSize } from './Input';

export interface SelectOption {
  value: string;
  label: string;
  group?: string;
  disabled?: boolean;
}

export interface SelectProps {
  label?: string;
  helperText?: string;
  errorText?: string;
  options: SelectOption[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  clearable?: boolean;
  size?: InputSize;
  state?: InputDisplayState;
  disabled?: boolean;
  required?: boolean;
  className?: string;
}

const sizeClasses: Record<InputSize, { button: string; text: string }> = {
  sm: { button: 'h-8 px-2.5 text-xs', text: 'text-xs' },
  md: { button: 'h-9 px-3 text-sm', text: 'text-xs' },
  lg: { button: 'h-11 px-4 text-base', text: 'text-sm' },
};

export function Select({
  label,
  helperText,
  errorText,
  options,
  value,
  onChange,
  placeholder = 'Select an option…',
  clearable = false,
  size = 'md',
  state,
  disabled = false,
  required = false,
  className,
}: SelectProps) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const currentSize = sizeClasses[size];

  const selectedOption = options.find((o) => o.value === value);
  const isError = Boolean(errorText) || state === 'error';
  const isDisabled = disabled || state === 'disabled';

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div ref={containerRef} className={cn('relative w-full flex flex-col gap-1', className)}>
      {label && (
        <label
          className={cn('font-medium text-foreground flex items-center gap-1', currentSize.text)}
        >
          {label}
          {required && <span className="text-danger">*</span>}
        </label>
      )}

      <button
        type="button"
        disabled={isDisabled}
        onClick={() => setOpen((prev) => !prev)}
        className={cn(
          'flex w-full items-center justify-between rounded-md border border-border bg-surface text-foreground shadow-soft transition-all text-start',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:border-primary',
          isDisabled && 'opacity-50 cursor-not-allowed bg-muted-surface',
          isError && 'border-danger focus-visible:ring-danger text-danger',
          state === 'hover' && 'border-primary ring-1 ring-primary/30',
          state === 'focus' && 'ring-2 ring-ring border-primary',
          currentSize.button,
        )}
      >
        <span className={cn('truncate', !selectedOption && 'text-muted')}>
          {selectedOption ? selectedOption.label : placeholder}
        </span>
        <div className="flex items-center gap-1 shrink-0 ps-2">
          {clearable && selectedOption && !isDisabled && (
            <span
              role="button"
              tabIndex={-1}
              onClick={(e) => {
                e.stopPropagation();
                onChange('');
              }}
              className="p-0.5 text-muted hover:text-foreground rounded"
            >
              <X className="h-3.5 w-3.5" />
            </span>
          )}
          <ChevronDown
            className={cn('h-4 w-4 text-muted transition-transform', open && 'rotate-180')}
          />
        </div>
      </button>

      {open && !isDisabled && (
        <div className="absolute top-full z-50 mt-1 max-h-60 w-full overflow-auto rounded-md border border-border bg-surface p-1 shadow-medium ring-1 ring-border">
          {options.length === 0 ? (
            <div className="p-3 text-center text-xs text-muted">No options available</div>
          ) : (
            options.map((opt) => {
              const isSelected = opt.value === value;
              return (
                <button
                  key={opt.value}
                  type="button"
                  disabled={opt.disabled}
                  onClick={() => {
                    onChange(opt.value);
                    setOpen(false);
                  }}
                  className={cn(
                    'flex w-full items-center justify-between rounded px-2.5 py-1.5 text-xs transition-colors text-start',
                    isSelected
                      ? 'bg-primary text-primary-fg font-semibold'
                      : 'text-foreground hover:bg-muted-surface',
                    opt.disabled && 'opacity-50 cursor-not-allowed',
                  )}
                >
                  <span className="truncate">{opt.label}</span>
                  {isSelected && <Check className="h-3.5 w-3.5 shrink-0" />}
                </button>
              );
            })
          )}
        </div>
      )}

      {errorText ? (
        <p className="text-[11px] text-danger">{errorText}</p>
      ) : helperText ? (
        <p className="text-[11px] text-muted">{helperText}</p>
      ) : null}
    </div>
  );
}
