import type { ColumnConfig, TableSort } from '../types';

export function compareValues(a: unknown, b: unknown): number {
  if (a === b) return 0;
  if (a === null || a === undefined) return 1;
  if (b === null || b === undefined) return -1;

  if (typeof a === 'number' && typeof b === 'number') {
    return a - b;
  }

  if (typeof a === 'boolean' && typeof b === 'boolean') {
    return a === b ? 0 : a ? 1 : -1;
  }

  const aDate =
    a instanceof Date ? a : typeof a === 'string' && !isNaN(Date.parse(a)) ? new Date(a) : null;
  const bDate =
    b instanceof Date ? b : typeof b === 'string' && !isNaN(Date.parse(b)) ? new Date(b) : null;
  if (aDate && bDate && !isNaN(aDate.getTime()) && !isNaN(bDate.getTime())) {
    return aDate.getTime() - bDate.getTime();
  }

  const aStr = String(a).toLowerCase();
  const bStr = String(b).toLowerCase();
  return aStr.localeCompare(bStr);
}

export function getColumnValue<T>(row: T, column?: ColumnConfig<T>): unknown {
  if (!column) return undefined;
  if (column.accessorFn) {
    return column.accessorFn(row);
  }
  if (column.accessorKey) {
    return (row as Record<string, unknown>)[column.accessorKey as string];
  }
  return (row as Record<string, unknown>)[column.id];
}

export function sortData<T>(data: T[], sorting: TableSort[], columns: ColumnConfig<T>[]): T[] {
  if (!sorting || sorting.length === 0) return [...data];

  const colMap = new Map<string, ColumnConfig<T>>(columns.map((c) => [c.id, c]));

  return [...data].sort((rowA, rowB) => {
    for (const sort of sorting) {
      const col = colMap.get(sort.id);
      const valA = getColumnValue(rowA, col);
      const valB = getColumnValue(rowB, col);

      const res = compareValues(valA, valB);
      if (res !== 0) {
        return sort.desc ? -res : res;
      }
    }
    return 0;
  });
}

export function toggleSort(current: TableSort[], columnId: string, multi = false): TableSort[] {
  const existing = current.find((s) => s.id === columnId);

  if (!multi) {
    if (!existing) {
      return [{ id: columnId, desc: false }];
    }
    if (!existing.desc) {
      return [{ id: columnId, desc: true }];
    }
    return [];
  }

  if (!existing) {
    return [...current, { id: columnId, desc: false }];
  }
  if (!existing.desc) {
    return current.map((s) => (s.id === columnId ? { ...s, desc: true } : s));
  }
  return current.filter((s) => s.id !== columnId);
}
