import { useState, useRef, useEffect } from 'react';
import { ChevronDown, Check, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { InputSize } from './Input';

export interface MultiSelectOption {
  value: string;
  label: string;
}

export interface MultiSelectProps {
  label?: string;
  helperText?: string;
  errorText?: string;
  options: MultiSelectOption[];
  value: string[];
  onChange: (value: string[]) => void;
  placeholder?: string;
  size?: InputSize;
  disabled?: boolean;
  required?: boolean;
  className?: string;
}

export function MultiSelect({
  label,
  helperText,
  errorText,
  options,
  value = [],
  onChange,
  placeholder = 'Select multiple…',
  size: _size = 'md',
  disabled = false,
  required = false,
  className,
}: MultiSelectProps) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState('');
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

  const filtered = options.filter((o) => o.label.toLowerCase().includes(search.toLowerCase()));

  const toggleOption = (val: string) => {
    if (value.includes(val)) {
      onChange(value.filter((v) => v !== val));
    } else {
      onChange([...value, val]);
    }
  };

  const removeValue = (val: string, e: React.MouseEvent) => {
    e.stopPropagation();
    onChange(value.filter((v) => v !== val));
  };

  return (
    <div ref={containerRef} className={cn('relative w-full flex flex-col gap-1', className)}>
      {label && (
        <label className="text-xs font-medium text-foreground flex items-center gap-1">
          {label}
          {required && <span className="text-danger">*</span>}
        </label>
      )}

      <div
        role="button"
        tabIndex={0}
        onClick={() => !disabled && setOpen((prev) => !prev)}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            if (!disabled) setOpen((prev) => !prev);
          }
        }}
        className={cn(
          'flex min-h-9 w-full flex-wrap items-center justify-between gap-1.5 rounded-md border border-border bg-surface px-2.5 py-1.5 text-xs text-foreground shadow-soft transition-all cursor-pointer',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:border-primary',
          disabled && 'opacity-50 cursor-not-allowed bg-muted-surface',
          errorText && 'border-danger focus-visible:ring-danger text-danger',
        )}
      >
        <div className="flex flex-wrap items-center gap-1 min-w-0 flex-1">
          {value.length === 0 ? (
            <span className="text-muted">{placeholder}</span>
          ) : (
            value.map((val) => {
              const opt = options.find((o) => o.value === val);
              return (
                <span
                  key={val}
                  className="inline-flex items-center gap-1 rounded bg-muted-surface border border-border px-1.5 py-0.5 text-[11px] font-medium text-foreground"
                >
                  <span className="truncate max-w-[120px]">{opt?.label ?? val}</span>
                  {!disabled && (
                    <X
                      className="h-3 w-3 text-muted hover:text-danger"
                      onClick={(e) => removeValue(val, e)}
                    />
                  )}
                </span>
              );
            })
          )}
        </div>

        <div className="flex items-center gap-1 shrink-0 ps-1">
          {value.length > 0 && !disabled && (
            <span
              role="button"
              tabIndex={-1}
              onClick={(e) => {
                e.stopPropagation();
                onChange([]);
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
      </div>

      {open && !disabled && (
        <div className="absolute top-full z-50 mt-1 max-h-60 w-full overflow-hidden rounded-md border border-border bg-surface p-1 shadow-medium ring-1 ring-border">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search items…"
            className="w-full rounded border border-border bg-muted-surface/50 px-2.5 py-1 text-xs text-foreground focus:outline-none focus:border-primary mb-1"
          />
          <div className="max-h-48 overflow-y-auto space-y-0.5">
            {filtered.length === 0 ? (
              <div className="p-2 text-center text-xs text-muted">No matching items</div>
            ) : (
              filtered.map((opt) => {
                const isSelected = value.includes(opt.value);
                return (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => toggleOption(opt.value)}
                    className={cn(
                      'flex w-full items-center justify-between rounded px-2 py-1.5 text-xs transition-colors text-start',
                      isSelected
                        ? 'bg-primary text-primary-fg font-semibold'
                        : 'text-foreground hover:bg-muted-surface',
                    )}
                  >
                    <span>{opt.label}</span>
                    {isSelected && <Check className="h-3.5 w-3.5 shrink-0" />}
                  </button>
                );
              })
            )}
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
