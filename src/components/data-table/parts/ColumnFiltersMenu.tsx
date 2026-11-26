import { useEffect, useRef, useState } from 'react';
import { Filter } from 'lucide-react';
import type { ColumnConfig, DateRangeValue, FilterValue, NumberRangeValue } from '../types';
import { isFilterActive } from '../utils/filtering';

interface ColumnFiltersMenuProps<T> {
  columns: ColumnConfig<T>[];
  filters: Record<string, FilterValue>;
  onFilterChange: (colId: string, val: FilterValue) => void;
}

export function ColumnFiltersMenu<T>({
  columns,
  filters,
  onFilterChange,
}: ColumnFiltersMenuProps<T>) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const filterable = columns.filter((c) => c.filterable !== false);
  const activeCount = Object.values(filters).filter(isFilterActive).length;

  useEffect(() => {
    function onDoc(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener('mousedown', onDoc);
    return () => document.removeEventListener('mousedown', onDoc);
  }, []);

  if (!filterable.length) return null;

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-surface px-3 py-1.5 text-xs font-semibold text-foreground hover:bg-surface-hover transition-colors shadow-xs"
      >
        <Filter className="h-3.5 w-3.5 text-muted" />
        <span>Filters</span>
        {activeCount > 0 && (
          <span className="rounded-full bg-primary text-primary-fg px-1.5 text-[10px]">
            {activeCount}
          </span>
        )}
      </button>
      {open && (
        <div className="absolute right-0 top-full mt-1.5 z-40 w-80 rounded-xl border border-border bg-surface p-3 shadow-medium space-y-3">
          <div className="text-xs font-bold text-foreground uppercase tracking-wider border-b border-border pb-1.5">
            Column filters
          </div>
          <div className="max-h-72 overflow-y-auto space-y-2.5 pr-1">
            {filterable.map((col) => (
              <FilterField
                key={col.id}
                column={col}
                value={filters[col.id]}
                onChange={(v) => onFilterChange(col.id, v)}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function FilterField<T>({
  column,
  value,
  onChange,
}: {
  column: ColumnConfig<T>;
  value: FilterValue;
  onChange: (v: FilterValue) => void;
}) {
  const title = typeof column.header === 'string' ? column.header : column.id;
  const type = column.filterType ?? 'text';

  if (type === 'select') {
    return (
      <label className="space-y-1 block">
        <span className="text-[11px] font-semibold text-muted">{title}</span>
        <select
          value={String(value ?? '')}
          onChange={(e) => onChange(e.target.value || null)}
          className="h-7 w-full rounded-md border border-border bg-surface px-2 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
        >
          <option value="">All</option>
          {column.filterOptions?.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </label>
    );
  }

  if (type === 'date-range') {
    const range = (value as DateRangeValue) ?? {};
    return (
      <fieldset className="space-y-1">
        <legend className="text-[11px] font-semibold text-muted">{title}</legend>
        <div className="grid grid-cols-2 gap-1.5">
          <input
            type="date"
            value={range.from ?? ''}
            onChange={(e) => onChange({ ...range, from: e.target.value || undefined })}
            className="h-7 w-full rounded-md border border-border bg-surface px-2 text-xs"
          />
          <input
            type="date"
            value={range.to ?? ''}
            onChange={(e) => onChange({ ...range, to: e.target.value || undefined })}
            className="h-7 w-full rounded-md border border-border bg-surface px-2 text-xs"
          />
        </div>
      </fieldset>
    );
  }

  if (type === 'number-range') {
    const range = (value as NumberRangeValue) ?? {};
    return (
      <fieldset className="space-y-1">
        <legend className="text-[11px] font-semibold text-muted">{title}</legend>
        <div className="grid grid-cols-2 gap-1.5">
          <input
            type="number"
            placeholder="Min"
            value={range.min ?? ''}
            onChange={(e) =>
              onChange({
                ...range,
                min: e.target.value === '' ? null : Number(e.target.value),
              })
            }
            className="h-7 w-full rounded-md border border-border bg-surface px-2 text-xs"
          />
          <input
            type="number"
            placeholder="Max"
            value={range.max ?? ''}
            onChange={(e) =>
              onChange({
                ...range,
                max: e.target.value === '' ? null : Number(e.target.value),
              })
            }
            className="h-7 w-full rounded-md border border-border bg-surface px-2 text-xs"
          />
        </div>
      </fieldset>
    );
  }

  return (
    <label className="space-y-1 block">
      <span className="text-[11px] font-semibold text-muted">{title}</span>
      <input
        type="text"
        value={typeof value === 'string' ? value : ''}
        placeholder={`Filter ${title}...`}
        onChange={(e) => onChange(e.target.value || null)}
        className="h-7 w-full rounded-md border border-border bg-surface px-2 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
      />
    </label>
  );
}
