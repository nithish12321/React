import { useState } from 'react';
import { Phone } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface PhoneInputProps {
  label?: string;
  helperText?: string;
  value: string;
  onChange: (phone: string) => void;
  disabled?: boolean;
  className?: string;
}

const COUNTRY_CODES = [
  { code: '+1', country: 'US' },
  { code: '+44', country: 'UK' },
  { code: '+91', country: 'IN' },
  { code: '+61', country: 'AU' },
  { code: '+49', country: 'DE' },
  { code: '+81', country: 'JP' },
];

export function PhoneInput({
  label,
  helperText,
  value,
  onChange,
  disabled = false,
  className,
}: PhoneInputProps) {
  const [selectedCode, setSelectedCode] = useState('+91');

  return (
    <div className={cn('w-full flex flex-col gap-1', className)}>
      {label && <label className="text-xs font-medium text-foreground">{label}</label>}

      <div
        className={cn(
          'relative flex h-9 w-full items-center rounded-md border border-border bg-surface text-foreground shadow-soft transition-all overflow-hidden',
          'focus-within:outline-none focus-within:ring-2 focus-within:ring-ring focus-within:border-primary',
          disabled && 'opacity-50 cursor-not-allowed bg-muted-surface',
        )}
      >
        <div className="flex items-center border-e border-border bg-muted-surface/50 px-2 shrink-0">
          <Phone className="h-3.5 w-3.5 text-muted me-1.5" />
          <select
            value={selectedCode}
            disabled={disabled}
            onChange={(e) => setSelectedCode(e.target.value)}
            className="bg-transparent text-xs font-medium text-foreground focus:outline-none cursor-pointer"
          >
            {COUNTRY_CODES.map((c) => (
              <option key={c.code} value={c.code}>
                {c.country} ({c.code})
              </option>
            ))}
          </select>
        </div>

        <input
          type="tel"
          value={value}
          disabled={disabled}
          onChange={(e) => onChange(e.target.value)}
          placeholder="98765 43210"
          className="w-full bg-transparent px-3 text-xs text-foreground placeholder:text-muted focus:outline-none disabled:cursor-not-allowed"
        />
      </div>

      {helperText && <p className="text-[11px] text-muted">{helperText}</p>}
    </div>
  );
}
