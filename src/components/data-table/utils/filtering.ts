import type { ColumnConfig, DateRangeValue, FilterValue, NumberRangeValue } from '../types';
import { getColumnValue } from './sorting';

export function matchText(value: unknown, query: string): boolean {
  if (value === null || value === undefined) return false;
  return String(value).toLowerCase().includes(query.toLowerCase().trim());
}

export function matchSelect(value: unknown, target: FilterValue): boolean {
  if (target === null || target === undefined || target === '') return true;
  if (Array.isArray(target)) {
    return target.includes(String(value));
  }
  return String(value) === String(target);
}

export function matchDateRange(value: unknown, range: DateRangeValue): boolean {
  if (!range || (!range.from && !range.to)) return true;
  if (value === null || value === undefined) return false;

  const date = value instanceof Date ? value : new Date(String(value));
  if (isNaN(date.getTime())) return false;

  const time = date.getTime();
  if (range.from) {
    const fromTime = new Date(range.from).getTime();
    if (!isNaN(fromTime) && time < fromTime) return false;
  }
  if (range.to) {
    const toDate = new Date(range.to);
    // Include the entire end date up to end of day
    toDate.setHours(23, 59, 59, 999);
    const toTime = toDate.getTime();
    if (!isNaN(toTime) && time > toTime) return false;
  }
  return true;
}

export function isFilterActive(value: FilterValue): boolean {
  if (value === null || value === undefined || value === '') return false;
  if (Array.isArray(value)) return value.length > 0;
  if (typeof value === 'object') {
    if ('from' in value || 'to' in value) {
      return Boolean(value.from || value.to);
    }
    if ('min' in value || 'max' in value) {
      return value.min != null || value.max != null;
    }
  }
  return true;
}

export function matchNumberRange(value: unknown, range: NumberRangeValue): boolean {
  if (!range || (range.min == null && range.max == null)) return true;
  if (value === null || value === undefined || value === '') return false;

  const num = Number(value);
  if (isNaN(num)) return false;

  if (range.min !== null && range.min !== undefined && num < range.min) return false;
  if (range.max !== null && range.max !== undefined && num > range.max) return false;
  return true;
}

export function filterData<T>(
  data: T[],
  search: string,
  filters: Record<string, FilterValue>,
  columns: ColumnConfig<T>[],
): T[] {
  const colMap = new Map<string, ColumnConfig<T>>(columns.map((c) => [c.id, c]));
  const trimmedSearch = search ? search.trim().toLowerCase() : '';

  return data.filter((row) => {
    // 1. Global search match
    if (trimmedSearch) {
      const matchesSearch = columns.some((col) => {
        if (col.filterable === false) return false;
        const val = getColumnValue(row, col);
        if (val === null || val === undefined) return false;
        return String(val).toLowerCase().includes(trimmedSearch);
      });
      if (!matchesSearch) return false;
    }

    // 2. Per-column filters match
    for (const [colId, filterVal] of Object.entries(filters)) {
      if (!isFilterActive(filterVal)) continue;
      const col = colMap.get(colId);
      if (!col) continue;

      const val = getColumnValue(row, col);
      const filterType = col.filterType || 'text';

      if (filterType === 'select') {
        if (!matchSelect(val, filterVal)) return false;
      } else if (filterType === 'date-range') {
        if (!matchDateRange(val, filterVal as DateRangeValue)) return false;
      } else if (filterType === 'number-range') {
        if (!matchNumberRange(val, filterVal as NumberRangeValue)) return false;
      } else {
        if (!matchText(val, String(filterVal))) return false;
      }
    }

    return true;
  });
}
