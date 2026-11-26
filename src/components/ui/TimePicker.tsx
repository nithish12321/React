import { Clock } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface TimePickerProps {
  label?: string;
  helperText?: string;
  value: string; // HH:mm
  onChange: (time: string) => void;
  disabled?: boolean;
  className?: string;
}

export function TimePicker({
  label,
  helperText,
  value = '12:00',
  onChange,
  disabled = false,
  className,
}: TimePickerProps) {
  return (
    <div className={cn('w-full flex flex-col gap-1', className)}>
      {label && <label className="text-xs font-medium text-foreground">{label}</label>}

      <div
        className={cn(
          'relative flex h-9 w-full items-center rounded-md border border-border bg-surface px-3 text-xs text-foreground shadow-soft transition-all',
          'focus-within:outline-none focus-within:ring-2 focus-within:ring-ring focus-within:border-primary',
          disabled && 'opacity-50 cursor-not-allowed bg-muted-surface',
        )}
      >
        <Clock className="h-4 w-4 text-muted shrink-0 me-2" />
        <input
          type="time"
          value={value}
          disabled={disabled}
          onChange={(e) => onChange(e.target.value)}
          className="w-full bg-transparent text-xs text-foreground focus:outline-none disabled:cursor-not-allowed"
        />
      </div>

      {helperText && <p className="text-[11px] text-muted">{helperText}</p>}
    </div>
  );
}
