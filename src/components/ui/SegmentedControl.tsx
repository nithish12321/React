import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

export interface SegmentedControlOption {
  value: string;
  label: string;
  disabled?: boolean;
}

export interface SegmentedControlProps {
  label?: string;
  options: SegmentedControlOption[];
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
  className?: string;
}

export function SegmentedControl({
  label,
  options,
  value,
  onChange,
  disabled = false,
  className,
}: SegmentedControlProps) {
  return (
    <div className={cn('flex flex-col gap-1', className)}>
      {label && <label className="text-xs font-medium text-foreground">{label}</label>}

      <div
        role="tablist"
        className={cn(
          'relative inline-flex items-center rounded-lg border border-border bg-muted-surface p-1 shadow-soft',
          disabled && 'opacity-50 pointer-events-none',
        )}
      >
        {options.map((opt) => {
          const isSelected = value === opt.value;
          return (
            <button
              key={opt.value}
              type="button"
              role="tab"
              aria-selected={isSelected}
              disabled={disabled || opt.disabled}
              onClick={() => onChange(opt.value)}
              className={cn(
                'relative z-10 rounded-md px-3 py-1 text-xs font-medium transition-colors cursor-pointer',
                isSelected ? 'text-foreground font-semibold' : 'text-muted hover:text-foreground',
                opt.disabled && 'opacity-50 cursor-not-allowed',
              )}
            >
              {isSelected && (
                <motion.div
                  layoutId="segmented-active"
                  className="absolute inset-0 -z-10 rounded-md bg-surface shadow-xs"
                  transition={{ type: 'spring', stiffness: 500, damping: 35 }}
                />
              )}
              {opt.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
