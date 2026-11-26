import type { Settings } from './types';

interface RowProps {
  label: string;
  hint?: string;
  children: React.ReactNode;
  htmlFor?: string;
}

export function Row({ label, hint, children, htmlFor }: RowProps) {
  return (
    <div className="flex items-center justify-between gap-4 py-2">
      <div className="min-w-0">
        <label htmlFor={htmlFor} className="block text-sm font-medium">
          {label}
        </label>
        {hint && <p className="text-xs text-muted">{hint}</p>}
      </div>
      <div className="shrink-0">{children}</div>
    </div>
  );
}

export function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <h3 className="mt-4 border-t border-border pt-3 text-xs font-semibold uppercase tracking-wide text-muted first:mt-0 first:border-0 first:pt-0">
      {children}
    </h3>
  );
}

export function SelectControl<T extends string>({
  value,
  options,
  onChange,
  id,
}: {
  value: T;
  options: readonly T[] | Array<{ value: T; label: string }>;
  onChange: (v: T) => void;
  id?: string;
}) {
  const normalized = options.map((o) =>
    typeof o === 'string' ? { value: o as T, label: o } : (o as { value: T; label: string }),
  );
  return (
    <select
      id={id}
      value={value}
      onChange={(e) => onChange(e.target.value as T)}
      className="rounded-md border border-border bg-surface px-2 py-1 text-sm capitalize"
    >
      {normalized.map((o) => (
        <option key={o.value} value={o.value}>
          {o.label}
        </option>
      ))}
    </select>
  );
}

export function SwitchControl({
  checked,
  onChange,
  label,
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
  label: string;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      onClick={() => onChange(!checked)}
      className={`relative h-5 w-9 rounded-full transition-colors ${checked ? 'bg-primary' : 'bg-muted-surface ring-1 ring-border'}`}
    >
      <span
        className={`absolute top-0.5 h-4 w-4 rounded-full bg-surface shadow-soft transition-all ${checked ? 'left-4.5' : 'left-0.5'}`}
      />
    </button>
  );
}

export function NumberStepper({
  value,
  min,
  max,
  step = 1,
  onChange,
  id,
}: {
  value: number;
  min: number;
  max: number;
  step?: number;
  onChange: (v: number) => void;
  id?: string;
}) {
  return (
    <div className="flex items-center gap-1">
      <button
        type="button"
        aria-label="Decrease"
        disabled={value <= min}
        onClick={() => onChange(Math.max(min, value - step))}
        className="h-6 w-6 rounded border border-border text-sm disabled:opacity-40"
      >
        −
      </button>
      <input
        id={id}
        type="number"
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-14 rounded border border-border bg-surface px-1 py-0.5 text-center text-sm"
      />
      <button
        type="button"
        aria-label="Increase"
        disabled={value >= max}
        onClick={() => onChange(Math.min(max, value + step))}
        className="h-6 w-6 rounded border border-border text-sm disabled:opacity-40"
      >
        +
      </button>
    </div>
  );
}

export function ColorSwatch({
  name,
  value,
  onChange,
}: {
  name: string;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <label className="flex flex-col items-center gap-1">
      <input
        type="color"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="h-8 w-8 cursor-pointer rounded border border-border bg-transparent p-0"
        aria-label={`${name} color`}
      />
      <span className="text-[10px] text-muted">{name}</span>
    </label>
  );
}

export type { Settings };
