import type { FilterValue, TableSort } from '../types';

export interface TableUrlSnapshot {
  page: number;
  pageSize: number;
  search: string;
  sorting: TableSort[];
  filters: Record<string, FilterValue>;
}

function prefix(tableId: string, key: string) {
  return `${tableId}_${key}`;
}

export function parseTableUrlState(
  searchParams: URLSearchParams,
  tableId: string,
): Partial<TableUrlSnapshot> {
  const out: Partial<TableUrlSnapshot> = {};
  const page = searchParams.get(prefix(tableId, 'page'));
  const pageSize = searchParams.get(prefix(tableId, 'size'));
  const search = searchParams.get(prefix(tableId, 'q'));
  const sort = searchParams.get(prefix(tableId, 'sort'));
  const filters = searchParams.get(prefix(tableId, 'f'));

  if (page) {
    const n = Number(page);
    if (!Number.isNaN(n) && n > 0) out.page = n;
  }
  if (pageSize) {
    const n = Number(pageSize);
    if (!Number.isNaN(n) && n > 0) out.pageSize = n;
  }
  if (search != null) out.search = search;
  if (sort) {
    out.sorting = sort.split(',').flatMap((part) => {
      const [id, dir] = part.split(':');
      if (!id) return [];
      return [{ id, desc: dir === 'desc' }];
    });
  }
  if (filters) {
    try {
      out.filters = JSON.parse(filters) as Record<string, FilterValue>;
    } catch {
      out.filters = {};
    }
  }
  return out;
}

export function writeTableUrlState(
  searchParams: URLSearchParams,
  tableId: string,
  state: TableUrlSnapshot,
  defaults: { pageSize: number },
): URLSearchParams {
  const next = new URLSearchParams(searchParams);
  const setOrDelete = (key: string, value: string | null) => {
    const k = prefix(tableId, key);
    if (value == null || value === '') next.delete(k);
    else next.set(k, value);
  };

  setOrDelete('page', state.page > 1 ? String(state.page) : null);
  setOrDelete('size', state.pageSize !== defaults.pageSize ? String(state.pageSize) : null);
  setOrDelete('q', state.search.trim() ? state.search : null);
  setOrDelete(
    'sort',
    state.sorting.length
      ? state.sorting.map((s) => `${s.id}:${s.desc ? 'desc' : 'asc'}`).join(',')
      : null,
  );

  const activeFilters = Object.fromEntries(
    Object.entries(state.filters).filter(([, v]) => v != null && v !== ''),
  );
  setOrDelete('f', Object.keys(activeFilters).length ? JSON.stringify(activeFilters) : null);
  return next;
}
