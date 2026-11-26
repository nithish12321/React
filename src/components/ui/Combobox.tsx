import { useState, useRef, useEffect } from 'react';
import { ChevronsUpDown, Check } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { InputSize } from './Input';

export interface ComboboxOption {
  value: string;
  label: string;
}

export interface ComboboxProps {
  label?: string;
  helperText?: string;
  errorText?: string;
  options: ComboboxOption[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  allowCustom?: boolean;
  size?: InputSize;
  disabled?: boolean;
  className?: string;
}

export function Combobox({
  label,
  helperText,
  errorText,
  options,
  value,
  onChange,
  placeholder = 'Select or type…',
  allowCustom = true,
  disabled = false,
  className,
}: ComboboxProps) {
  const [open, setOpen] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const containerRef = useRef<HTMLDivElement>(null);

  const selectedOption = options.find((o) => o.value === value);

  useEffect(() => {
    if (selectedOption) {
      setInputValue(selectedOption.label);
    } else {
      setInputValue(value);
    }
  }, [selectedOption, value]);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const filtered = options.filter((o) => o.label.toLowerCase().includes(inputValue.toLowerCase()));

  const handleSelect = (val: string, lbl: string) => {
    onChange(val);
    setInputValue(lbl);
    setOpen(false);
  };

  return (
    <div ref={containerRef} className={cn('relative w-full flex flex-col gap-1', className)}>
      {label && <label className="text-xs font-medium text-foreground">{label}</label>}

      <div
        className={cn(
          'relative flex h-9 w-full items-center rounded-md border border-border bg-surface text-foreground shadow-soft transition-all',
          'focus-within:outline-none focus-within:ring-2 focus-within:ring-ring focus-within:border-primary',
          disabled && 'opacity-50 cursor-not-allowed bg-muted-surface',
          errorText && 'border-danger focus-within:ring-danger text-danger',
        )}
      >
        <input
          type="text"
          value={inputValue}
          disabled={disabled}
          onChange={(e) => {
            setInputValue(e.target.value);
            if (allowCustom) onChange(e.target.value);
            setOpen(true);
          }}
          onFocus={() => !disabled && setOpen(true)}
          placeholder={placeholder}
          className="w-full bg-transparent px-3 text-xs text-foreground placeholder:text-muted focus:outline-none disabled:cursor-not-allowed"
        />

        <button
          type="button"
          tabIndex={-1}
          disabled={disabled}
          onClick={() => !disabled && setOpen((prev) => !prev)}
          className="pe-2 text-muted hover:text-foreground"
        >
          <ChevronsUpDown className="h-4 w-4" />
        </button>
      </div>

      {open && !disabled && (
        <div className="absolute top-full z-50 mt-1 max-h-56 w-full overflow-y-auto rounded-md border border-border bg-surface p-1 shadow-medium ring-1 ring-border">
          {filtered.length === 0 ? (
            <div className="p-2 text-center text-xs text-muted">
              {allowCustom && inputValue.trim() ? (
                <button
                  type="button"
                  onClick={() => handleSelect(inputValue, inputValue)}
                  className="w-full text-start px-2 py-1 text-primary hover:underline"
                >
                  Create &quot;{inputValue}&quot;
                </button>
              ) : (
                'No results found'
              )}
            </div>
          ) : (
            filtered.map((opt) => {
              const isSelected = value === opt.value;
              return (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => handleSelect(opt.value, opt.label)}
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
      )}

      {errorText ? (
        <p className="text-[11px] text-danger">{errorText}</p>
      ) : helperText ? (
        <p className="text-[11px] text-muted">{helperText}</p>
      ) : null}
    </div>
  );
}
