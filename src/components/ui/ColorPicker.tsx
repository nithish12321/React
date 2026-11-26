import { Pipette } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface ColorPickerProps {
  label?: string;
  helperText?: string;
  value: string; // Hex color
  onChange: (color: string) => void;
  presets?: string[];
  disabled?: boolean;
  className?: string;
}

const DEFAULT_SWATCHES = [
  '#3b82f6',
  '#10b981',
  '#f59e0b',
  '#ef4444',
  '#8b5cf6',
  '#ec4899',
  '#06b6d4',
  '#64748b',
];

export function ColorPicker({
  label,
  helperText,
  value = '#3b82f6',
  onChange,
  presets = DEFAULT_SWATCHES,
  disabled = false,
  className,
}: ColorPickerProps) {
  return (
    <div className={cn('w-full flex flex-col gap-1.5', className)}>
      {label && <label className="text-xs font-medium text-foreground">{label}</label>}

      <div className="flex items-center gap-2">
        <div className="relative flex h-9 w-9 shrink-0 items-center justify-center rounded-md border border-border shadow-soft overflow-hidden">
          <input
            type="color"
            value={value}
            disabled={disabled}
            onChange={(e) => onChange(e.target.value)}
            className="absolute -inset-2 h-14 w-14 cursor-pointer border-0 opacity-0"
          />
          <div className="h-full w-full" style={{ backgroundColor: value }} />
          <Pipette className="absolute h-3.5 w-3.5 text-white drop-shadow pointer-events-none" />
        </div>

        <input
          type="text"
          value={value}
          disabled={disabled}
          onChange={(e) => onChange(e.target.value)}
          className="h-9 w-28 rounded-md border border-border bg-surface px-2.5 font-mono text-xs text-foreground uppercase shadow-soft focus:outline-none focus:ring-2 focus:ring-ring"
        />

        {/* Swatches */}
        <div className="flex flex-wrap items-center gap-1">
          {presets.map((color) => (
            <button
              key={color}
              type="button"
              disabled={disabled}
              onClick={() => onChange(color)}
              className={cn(
                'h-6 w-6 rounded-full border border-border shadow-xs transition-transform hover:scale-110 focus:outline-none focus-visible:ring-2 focus-visible:ring-ring',
                value.toLowerCase() === color.toLowerCase() && 'ring-2 ring-primary ring-offset-1',
              )}
              style={{ backgroundColor: color }}
              aria-label={`Color preset ${color}`}
            />
          ))}
        </div>
      </div>

      {helperText && <p className="text-[11px] text-muted">{helperText}</p>}
    </div>
  );
}
