import { useState } from 'react';
import { DollarSign } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface CurrencyInputProps {
  label?: string;
  helperText?: string;
  value: number;
  onChange: (value: number) => void;
  currency?: string;
  disabled?: boolean;
  className?: string;
}

export function CurrencyInput({
  label,
  helperText,
  value,
  onChange,
  currency = '$',
  disabled = false,
  className,
}: CurrencyInputProps) {
  const [displayVal, setDisplayVal] = useState(value ? Number(value).toLocaleString('en-US') : '');

  const handleChange = (raw: string) => {
    const digitsOnly = raw.replace(/[^\d.]/g, '');
    const num = parseFloat(digitsOnly) || 0;
    onChange(num);
    setDisplayVal(digitsOnly);
  };

  const handleBlur = () => {
    setDisplayVal(value ? Number(value).toLocaleString('en-US') : '');
  };

  return (
    <div className={cn('w-full flex flex-col gap-1', className)}>
      {label && <label className="text-xs font-medium text-foreground">{label}</label>}

      <div
        className={cn(
          'relative flex h-9 w-full items-center rounded-md border border-border bg-surface text-foreground shadow-soft transition-all',
          'focus-within:outline-none focus-within:ring-2 focus-within:ring-ring focus-within:border-primary',
          disabled && 'opacity-50 cursor-not-allowed bg-muted-surface',
        )}
      >
        <div className="ps-3 pe-1.5 text-muted font-bold text-xs select-none">
          {currency === '$' ? <DollarSign className="h-3.5 w-3.5" /> : currency}
        </div>

        <input
          type="text"
          value={displayVal}
          disabled={disabled}
          onChange={(e) => handleChange(e.target.value)}
          onBlur={handleBlur}
          placeholder="0.00"
          className="w-full bg-transparent pe-3 text-xs text-foreground placeholder:text-muted focus:outline-none disabled:cursor-not-allowed font-mono"
        />
      </div>

      {helperText && <p className="text-[11px] text-muted">{helperText}</p>}
    </div>
  );
}
