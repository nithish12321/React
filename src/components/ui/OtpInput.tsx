import { useRef, type KeyboardEvent, type ClipboardEvent } from 'react';
import { cn } from '@/lib/utils';

export interface OtpInputProps {
  label?: string;
  helperText?: string;
  length?: number;
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
  className?: string;
}

export function OtpInput({
  label,
  helperText,
  length = 6,
  value,
  onChange,
  disabled = false,
  className,
}: OtpInputProps) {
  const inputsRef = useRef<Array<HTMLInputElement | null>>([]);
  const digits = value.split('').slice(0, length);
  while (digits.length < length) digits.push('');

  const handleDigitChange = (index: number, char: string) => {
    const val = char.slice(-1);
    const nextDigits = [...digits];
    nextDigits[index] = val;
    const combined = nextDigits.join('');
    onChange(combined);

    if (val && index < length - 1) {
      inputsRef.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !digits[index] && index > 0) {
      inputsRef.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData('text').slice(0, length);
    onChange(pasted);
    const nextFocus = Math.min(pasted.length, length - 1);
    inputsRef.current[nextFocus]?.focus();
  };

  return (
    <div className={cn('flex flex-col gap-1.5', className)}>
      {label && <label className="text-xs font-medium text-foreground">{label}</label>}

      <div className="flex items-center gap-2">
        {digits.map((digit, i) => (
          <input
            key={i}
            ref={(el) => {
              inputsRef.current[i] = el;
            }}
            type="text"
            inputMode="numeric"
            maxLength={1}
            value={digit}
            disabled={disabled}
            onChange={(e) => handleDigitChange(i, e.target.value)}
            onKeyDown={(e) => handleKeyDown(i, e)}
            onPaste={handlePaste}
            className={cn(
              'h-11 w-10 text-center text-lg font-bold font-mono rounded-md border border-border bg-surface text-foreground shadow-soft transition-all',
              'focus:outline-none focus:ring-2 focus:ring-ring focus:border-primary',
              disabled && 'opacity-50 cursor-not-allowed bg-muted-surface',
              digit && 'border-primary',
            )}
            aria-label={`Digit ${i + 1}`}
          />
        ))}
      </div>

      {helperText && <p className="text-[11px] text-muted">{helperText}</p>}
    </div>
  );
}
