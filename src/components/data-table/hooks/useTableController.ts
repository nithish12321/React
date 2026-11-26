import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useDebounce } from '@/hooks/useDebounce';
import { useAppDispatch, useAppSelector } from '@/app/hooks';
import { upsertTableState } from '@/features/tableState/tableStateSlice';
import { filterData, isFilterActive } from '../utils/filtering';
import { paginateData } from '../utils/pagination';
import { sortData, toggleSort } from '../utils/sorting';
import { parseTableUrlState } from '../utils/urlState';
import { useTableUrlSync } from './useTableUrlSync';
import type { DataTableProps, FilterValue, TableQuery, TableState } from '../types';
import type { TableUrlSnapshot as UrlSnap } from '../utils/urlState';

export function useTableController<T>(props: DataTableProps<T>) {
  const { id, columns, mode, data = [], fetchData, pagination = 'pages' } = props;
  const dispatch = useAppDispatch();
  const settingsTable = useAppSelector((s) => s.settings.value.table);
  const defaultPageSize = settingsTable.pageSize || 10;

  const [tableState, setTableState] = useState<TableState>(() => {
    const defaults: TableState = {
      page: 1,
      pageSize: defaultPageSize,
      sorting: [],
      filters: {},
      search: '',
    };
    if (!props.syncToUrl || typeof window === 'undefined') return defaults;
    const parsed = parseTableUrlState(new URLSearchParams(window.location.search), id);
    return {
      ...defaults,
      ...parsed,
      sorting: parsed.sorting ?? defaults.sorting,
      filters: parsed.filters ?? defaults.filters,
      search: parsed.search ?? defaults.search,
    };
  });
  const [serverRows, setServerRows] = useState<T[]>([]);
  const [totalRows, setTotalRows] = useState(mode === 'client' ? data.length : 0);
  const [loading, setLoading] = useState(mode === 'server');
  const [error, setError] = useState<string | null>(null);
  const requestSeq = useRef(0);

  const debouncedSearch = useDebounce(tableState.search, 300);

  const applyUrl = useCallback((partial: Partial<UrlSnap>) => {
    setTableState((prev) => ({
      ...prev,
      ...partial,
      sorting: partial.sorting ?? prev.sorting,
      filters: partial.filters ?? prev.filters,
    }));
  }, []);

  const urlSnapshot: UrlSnap = useMemo(
    () => ({
      page: tableState.page,
      pageSize: tableState.pageSize,
      search: debouncedSearch,
      sorting: tableState.sorting,
      filters: tableState.filters,
    }),
    [debouncedSearch, tableState],
  );

  useTableUrlSync(id, Boolean(props.syncToUrl), urlSnapshot, applyUrl, defaultPageSize);

  useEffect(() => {
    dispatch(
      upsertTableState({
        id,
        value: {
          page: tableState.page,
          pageSize: tableState.pageSize,
          sorting: tableState.sorting,
          filters: tableState.filters,
          search: debouncedSearch,
          hiddenColumns: [],
        },
      }),
    );
  }, [dispatch, id, tableState, debouncedSearch]);

  const query: TableQuery = useMemo(
    () => ({
      page: tableState.page,
      pageSize: tableState.pageSize,
      sorting: tableState.sorting.length ? tableState.sorting : undefined,
      filters: Object.fromEntries(
        Object.entries(tableState.filters).filter(([, v]) => isFilterActive(v)),
      ),
      search: debouncedSearch || undefined,
    }),
    [debouncedSearch, tableState],
  );

  useEffect(() => {
    if (mode !== 'server' || !fetchData) return;
    const seq = ++requestSeq.current;
    setLoading(true);
    setError(null);
    fetchData(query)
      .then((res) => {
        if (seq !== requestSeq.current) return;
        setTotalRows(res.total);
        setServerRows((prev) =>
          pagination === 'infinite' && query.page > 1 ? [...prev, ...res.rows] : res.rows,
        );
      })
      .catch((err: unknown) => {
        if (seq !== requestSeq.current) return;
        setError(err instanceof Error ? err.message : 'Failed to load rows');
        if (pagination !== 'infinite' || query.page === 1) setServerRows([]);
      })
      .finally(() => {
        if (seq === requestSeq.current) setLoading(false);
      });
  }, [fetchData, mode, pagination, query]);

  const clientProcessed = useMemo(() => {
    if (mode !== 'client') return null;
    const filtered = filterData(data, debouncedSearch, tableState.filters, columns);
    const sorted = sortData(filtered, tableState.sorting, columns);
    if (pagination === 'infinite') {
      const end = tableState.page * tableState.pageSize;
      return {
        rows: sorted.slice(0, end),
        total: sorted.length,
        startIndex: sorted.length ? 1 : 0,
        endIndex: Math.min(end, sorted.length),
        totalPages: Math.max(1, Math.ceil(sorted.length / tableState.pageSize)),
      };
    }
    return paginateData(sorted, tableState.page, tableState.pageSize);
  }, [columns, data, debouncedSearch, mode, pagination, tableState]);

  const rows = mode === 'client' ? (clientProcessed?.rows ?? []) : serverRows;
  const total = mode === 'client' ? (clientProcessed?.total ?? 0) : totalRows;
  const totalPages = Math.max(1, Math.ceil(total / tableState.pageSize));
  const startIndex = total === 0 ? 0 : (tableState.page - 1) * tableState.pageSize + 1;
  const endIndex =
    pagination === 'infinite'
      ? rows.length
      : Math.min(total, tableState.page * tableState.pageSize);

  const handleSort = (colId: string, multi: boolean) => {
    setTableState((prev) => ({
      ...prev,
      page: 1,
      sorting: toggleSort(prev.sorting, colId, multi),
    }));
  };

  const handleFilterChange = (colId: string, value: FilterValue) => {
    setTableState((prev) => {
      const filters = { ...prev.filters };
      if (!isFilterActive(value)) delete filters[colId];
      else filters[colId] = value;
      return { ...prev, page: 1, filters };
    });
  };

  const handleSearchChange = (val: string) => {
    setTableState((prev) => ({ ...prev, search: val, page: 1 }));
  };

  const handlePageChange = (newPage: number) => {
    setTableState((prev) => ({ ...prev, page: newPage }));
  };

  const handlePageSizeChange = (newSize: number) => {
    setTableState((prev) => ({ ...prev, pageSize: newSize, page: 1 }));
    if (pagination === 'infinite') setServerRows([]);
  };

  const clearFilters = () => {
    setTableState((prev) => ({ ...prev, search: '', filters: {}, page: 1 }));
  };

  const loadMore = () => {
    if (tableState.page < totalPages) handlePageChange(tableState.page + 1);
  };

  const retry = () => setTableState((prev) => ({ ...prev }));

  const allFilteredRows = useMemo(() => {
    if (mode !== 'client') return data;
    return sortData(
      filterData(data, debouncedSearch, tableState.filters, columns),
      tableState.sorting,
      columns,
    );
  }, [columns, data, debouncedSearch, mode, tableState.filters, tableState.sorting]);

  return {
    tableState,
    rows,
    total,
    totalPages,
    startIndex,
    endIndex,
    loading,
    error,
    query,
    allFilteredRows,
    handleSort,
    handleFilterChange,
    handleSearchChange,
    handlePageChange,
    handlePageSizeChange,
    clearFilters,
    loadMore,
    retry,
    stripedDefault: settingsTable.striped,
    densityDefault: settingsTable.density,
  };
}
