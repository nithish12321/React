import { useState } from 'react';
import { cn } from '@/lib/utils';

const LOCATIONS: Record<string, Record<string, string[]>> = {
  USA: {
    California: ['Los Angeles', 'San Francisco', 'San Diego'],
    NewYork: ['New York City', 'Buffalo', 'Albany'],
  },
  India: {
    Maharashtra: ['Mumbai', 'Pune', 'Nagpur'],
    Karnataka: ['Bengaluru', 'Mysuru', 'Hubballi'],
  },
};

export interface CascadingSelectProps {
  label?: string;
  helperText?: string;
  className?: string;
}

export function CascadingSelect({
  label = 'Cascading Location Select',
  helperText,
  className,
}: CascadingSelectProps) {
  const [country, setCountry] = useState('USA');
  const [state, setState] = useState('California');
  const [city, setCity] = useState('San Francisco');

  const availableStates = country ? Object.keys(LOCATIONS[country] ?? {}) : [];
  const availableCities = country && state ? (LOCATIONS[country]?.[state] ?? []) : [];

  const handleCountryChange = (c: string) => {
    setCountry(c);
    const firstState = Object.keys(LOCATIONS[c] ?? {})[0] ?? '';
    setState(firstState);
    setCity(LOCATIONS[c]?.[firstState]?.[0] ?? '');
  };

  const handleStateChange = (s: string) => {
    setState(s);
    setCity(LOCATIONS[country]?.[s]?.[0] ?? '');
  };

  return (
    <div className={cn('w-full flex flex-col gap-2', className)}>
      {label && <label className="text-xs font-medium text-foreground">{label}</label>}

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
        <div>
          <span className="text-[11px] text-muted block mb-1">Country</span>
          <select
            value={country}
            onChange={(e) => handleCountryChange(e.target.value)}
            className="w-full h-9 rounded-md border border-border bg-surface px-2.5 text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
          >
            {Object.keys(LOCATIONS).map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>

        <div>
          <span className="text-[11px] text-muted block mb-1">State / Province</span>
          <select
            value={state}
            onChange={(e) => handleStateChange(e.target.value)}
            className="w-full h-9 rounded-md border border-border bg-surface px-2.5 text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
          >
            {availableStates.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>

        <div>
          <span className="text-[11px] text-muted block mb-1">City</span>
          <select
            value={city}
            onChange={(e) => setCity(e.target.value)}
            className="w-full h-9 rounded-md border border-border bg-surface px-2.5 text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
          >
            {availableCities.map((ct) => (
              <option key={ct} value={ct}>
                {ct}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="mt-1 text-[11px] text-muted font-mono bg-muted-surface/40 p-1.5 rounded border border-border">
        Selected: {country} → {state} → {city}
      </div>

      {helperText && <p className="text-[11px] text-muted">{helperText}</p>}
    </div>
  );
}
