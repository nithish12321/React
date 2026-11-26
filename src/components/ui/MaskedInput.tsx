import { CreditCard } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface MaskedInputProps {
  label?: string;
  helperText?: string;
  mask?: string; // e.g. "#### #### #### ####"
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
}

export function MaskedInput({
  label,
  helperText,
  mask = '#### #### #### ####',
  value,
  onChange,
  placeholder = 'Card number',
  disabled = false,
  className,
}: MaskedInputProps) {
  const applyMask = (raw: string) => {
    const unmasked = raw.replace(/\D/g, '');
    let result = '';
    let unmaskedIndex = 0;

    for (let i = 0; i < mask.length && unmaskedIndex < unmasked.length; i++) {
      if (mask[i] === '#') {
        result += unmasked[unmaskedIndex];
        unmaskedIndex++;
      } else {
        result += mask[i];
      }
    }
    return result;
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
        <CreditCard className="ms-2.5 h-4 w-4 text-muted shrink-0" />
        <input
          type="text"
          value={value}
          disabled={disabled}
          onChange={(e) => onChange(applyMask(e.target.value))}
          placeholder={placeholder}
          className="w-full bg-transparent px-2.5 text-xs text-foreground placeholder:text-muted focus:outline-none disabled:cursor-not-allowed font-mono"
        />
      </div>

      {helperText && <p className="text-[11px] text-muted">{helperText}</p>}
    </div>
  );
}
