import * as RadixSlider from '@radix-ui/react-slider';
import { cn } from '@/lib/utils';

export interface SliderProps {
  label?: string;
  helperText?: string;
  value: number[];
  onChange: (value: number[]) => void;
  min?: number;
  max?: number;
  step?: number;
  disabled?: boolean;
  showValue?: boolean;
  className?: string;
}

export function Slider({
  label,
  helperText,
  value,
  onChange,
  min = 0,
  max = 100,
  step = 1,
  disabled = false,
  showValue = true,
  className,
}: SliderProps) {
  const isRange = value.length > 1;

  return (
    <div className={cn('w-full flex flex-col gap-2', className)}>
      <div className="flex items-center justify-between">
        {label && <label className="text-xs font-medium text-foreground">{label}</label>}
        {showValue && (
          <span className="text-xs font-mono font-medium text-muted">
            {isRange ? `${value[0]} – ${value[1]}` : value[0]}
          </span>
        )}
      </div>

      <RadixSlider.Root
        value={value}
        onValueChange={onChange}
        min={min}
        max={max}
        step={step}
        disabled={disabled}
        className={cn(
          'relative flex w-full touch-none select-none items-center py-2',
          disabled && 'opacity-50 cursor-not-allowed',
        )}
      >
        <RadixSlider.Track className="relative h-2 w-full grow overflow-hidden rounded-full bg-muted-surface border border-border">
          <RadixSlider.Range className="absolute h-full bg-primary" />
        </RadixSlider.Track>
        {value.map((_, i) => (
          <RadixSlider.Thumb
            key={i}
            className="block h-4 w-4 rounded-full border border-primary/50 bg-surface shadow-medium transition-colors hover:scale-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring cursor-pointer"
            aria-label={label ?? `Slider handle ${i + 1}`}
          />
        ))}
      </RadixSlider.Root>

      {helperText && <p className="text-[11px] text-muted">{helperText}</p>}
    </div>
  );
}
