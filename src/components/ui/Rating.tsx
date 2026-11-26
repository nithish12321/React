import { useState } from 'react';
import { Star } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface RatingProps {
  label?: string;
  helperText?: string;
  max?: number;
  value: number;
  onChange?: (val: number) => void;
  disabled?: boolean;
  className?: string;
}

export function Rating({
  label,
  helperText,
  max = 5,
  value,
  onChange,
  disabled = false,
  className,
}: RatingProps) {
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);

  const activeVal = hoverIndex !== null ? hoverIndex : value;

  return (
    <div className={cn('flex flex-col gap-1', className)}>
      {label && <label className="text-xs font-medium text-foreground">{label}</label>}

      <div className="flex items-center gap-1">
        {Array.from({ length: max }).map((_, i) => {
          const starVal = i + 1;
          const isFilled = starVal <= activeVal;
          return (
            <button
              key={i}
              type="button"
              disabled={disabled}
              onMouseEnter={() => !disabled && setHoverIndex(starVal)}
              onMouseLeave={() => !disabled && setHoverIndex(null)}
              onClick={() => onChange?.(starVal)}
              className={cn(
                'p-0.5 rounded transition-transform hover:scale-110 focus:outline-none focus-visible:ring-1 focus-visible:ring-ring',
                disabled && 'opacity-50 cursor-not-allowed',
              )}
              aria-label={`Rate ${starVal} out of ${max}`}
            >
              <Star
                className={cn(
                  'h-4 w-4 transition-colors',
                  isFilled ? 'fill-warning text-warning' : 'text-muted/40',
                )}
              />
            </button>
          );
        })}
        <span className="ms-1.5 text-xs font-mono font-medium text-muted">
          {value.toFixed(1)} / {max}
        </span>
      </div>

      {helperText && <p className="text-[11px] text-muted">{helperText}</p>}
    </div>
  );
}
