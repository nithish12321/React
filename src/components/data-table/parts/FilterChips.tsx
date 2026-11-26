import { X, RotateCcw } from 'lucide-react';
import type { ColumnConfig, DateRangeValue, FilterValue, NumberRangeValue } from '../types';
import { isFilterActive } from '../utils/filtering';

interface FilterChipsProps<T> {
  search: string;
  onClearSearch: () => void;
  filters: Record<string, FilterValue>;
  columns: ColumnConfig<T>[];
  onRemoveFilter: (colId: string) => void;
  onClearAll: () => void;
}

function formatFilterLabel(value: FilterValue): string {
  if (value === null || value === undefined || value === '') return '';
  if (typeof value === 'object') {
    if ('from' in value || 'to' in value) {
      const range = value as DateRangeValue;
      if (range.from && range.to) return `${range.from} → ${range.to}`;
      if (range.from) return `From ${range.from}`;
      if (range.to) return `To ${range.to}`;
    }
    if ('min' in value || 'max' in value) {
      const range = value as NumberRangeValue;
      if (range.min !== null && range.max !== null) return `${range.min} - ${range.max}`;
      if (range.min !== null) return `≥ ${range.min}`;
      if (range.max !== null) return `≤ ${range.max}`;
    }
  }
  return String(value);
}

export function FilterChips<T>({
  search,
  onClearSearch,
  filters,
  columns,
  onRemoveFilter,
  onClearAll,
}: FilterChipsProps<T>) {
  const colMap = new Map(columns.map((c) => [c.id, c]));
  const activeEntries = Object.entries(filters).filter(([, val]) => isFilterActive(val));

  const hasSearch = Boolean(search && search.trim());
  const hasFilters = activeEntries.length > 0;

  if (!hasSearch && !hasFilters) return null;

  return (
    <div className="flex flex-wrap items-center gap-2 pt-2">
      <span className="text-xs font-semibold text-muted uppercase tracking-wider">
        Active Filters:
      </span>

      {hasSearch && (
        <span className="inline-flex items-center gap-1.5 rounded-full border border-primary/20 bg-primary/10 px-2.5 py-1 text-xs font-medium text-primary">
          <span>Search: &ldquo;{search}&rdquo;</span>
          <button
            type="button"
            onClick={onClearSearch}
            className="rounded-full p-0.5 hover:bg-primary/20 transition-colors"
            title="Clear search"
          >
            <X className="h-3 w-3" />
          </button>
        </span>
      )}

      {activeEntries.map(([colId, val]) => {
        const col = colMap.get(colId);
        const headerTitle = typeof col?.header === 'string' ? col.header : colId;
        const formatted = formatFilterLabel(val);
        if (!formatted) return null;

        return (
          <span
            key={colId}
            className="inline-flex items-center gap-1.5 rounded-full border border-border bg-surface px-2.5 py-1 text-xs font-medium text-foreground shadow-xs"
          >
            <span className="text-muted">{headerTitle}:</span>
            <span className="font-semibold">{formatted}</span>
            <button
              type="button"
              onClick={() => onRemoveFilter(colId)}
              className="rounded-full p-0.5 text-muted hover:text-foreground hover:bg-surface-hover transition-colors"
              title={`Remove ${headerTitle} filter`}
            >
              <X className="h-3 w-3" />
            </button>
          </span>
        );
      })}

      <button
        type="button"
        onClick={onClearAll}
        className="inline-flex items-center gap-1 text-xs font-medium text-danger hover:underline ml-1"
      >
        <RotateCcw className="h-3 w-3" />
        <span>Clear all</span>
      </button>
    </div>
  );
}
