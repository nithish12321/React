import { useState, useRef, useEffect } from 'react';
import { format, isValid, parseISO } from 'date-fns';
import { Calendar as CalendarIcon, X } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface DatePickerProps {
  label?: string;
  helperText?: string;
  errorText?: string;
  value?: string; // ISO date string YYYY-MM-DD
  onChange: (date: string) => void;
  placeholder?: string;
  disabled?: boolean;
  clearable?: boolean;
  className?: string;
}

export function DatePicker({
  label,
  helperText,
  errorText,
  value,
  onChange,
  placeholder = 'Select date (YYYY-MM-DD)…',
  disabled = false,
  clearable = true,
  className,
}: DatePickerProps) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const parsedDate = value ? parseISO(value) : null;
  const displayDate = parsedDate && isValid(parsedDate) ? format(parsedDate, 'PPP') : '';

  return (
    <div ref={containerRef} className={cn('relative w-full flex flex-col gap-1', className)}>
      {label && <label className="text-xs font-medium text-foreground">{label}</label>}

      <div
        className={cn(
          'relative flex h-9 w-full items-center justify-between rounded-md border border-border bg-surface px-3 text-xs text-foreground shadow-soft transition-all',
          'focus-within:outline-none focus-within:ring-2 focus-within:ring-ring focus-within:border-primary',
          disabled && 'opacity-50 cursor-not-allowed bg-muted-surface',
          errorText && 'border-danger focus-within:ring-danger text-danger',
        )}
      >
        <button
          type="button"
          disabled={disabled}
          onClick={() => setOpen((prev) => !prev)}
          className="flex flex-1 items-center gap-2 text-start focus:outline-none"
        >
          <CalendarIcon className="h-4 w-4 text-muted shrink-0" />
          <span className={cn('truncate', !displayDate && 'text-muted')}>
            {displayDate || placeholder}
          </span>
        </button>

        {clearable && value && !disabled && (
          <button
            type="button"
            onClick={() => onChange('')}
            className="p-1 text-muted hover:text-foreground"
            aria-label="Clear date"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        )}
      </div>

      {open && !disabled && (
        <div className="absolute top-full z-50 mt-1 rounded-lg border border-border bg-surface p-3 shadow-medium ring-1 ring-border">
          <input
            type="date"
            value={value ?? ''}
            onChange={(e) => {
              onChange(e.target.value);
              setOpen(false);
            }}
            className="rounded border border-border bg-muted-surface p-2 text-xs text-foreground focus:outline-none focus:border-primary"
          />
          <div className="mt-2 flex gap-1 justify-end">
            <button
              type="button"
              onClick={() => {
                onChange(format(new Date(), 'yyyy-MM-dd'));
                setOpen(false);
              }}
              className="rounded bg-primary/10 px-2 py-1 text-[11px] font-medium text-primary hover:bg-primary/20"
            >
              Today
            </button>
          </div>
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
