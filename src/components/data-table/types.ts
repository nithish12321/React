import type { ReactNode } from 'react';

export type RowIdGetter<T> = (row: T) => string;

export type CellRendererName =
  | 'badge'
  | 'avatar'
  | 'progress'
  | 'link'
  | 'currency'
  | 'date'
  | 'boolean'
  | 'inline-edit';

export type FilterType = 'text' | 'select' | 'date-range' | 'number-range';

export interface ColumnConfig<T> {
  id: string;
  header: string | ((props: { column: ColumnConfig<T> }) => ReactNode);
  accessorKey?: keyof T & string;
  accessorFn?: (row: T) => unknown;
  cell?: (props: { row: T; value: unknown; getValue: () => unknown }) => ReactNode;
  cellRenderer?: CellRendererName;
  cellRendererProps?: Record<string, unknown>;
  sortable?: boolean;
  filterable?: boolean;
  filterType?: FilterType;
  filterOptions?: { label: string; value: string }[];
  width?: number;
  minWidth?: number;
  maxWidth?: number;
  pinned?: 'left' | 'right';
  editable?: boolean;
  onEdit?: (row: T, newValue: string) => Promise<void> | void;
}

export interface TableSort {
  id: string;
  desc: boolean;
}

export type DateRangeValue = { from?: string; to?: string };
export type NumberRangeValue = { min?: number | null; max?: number | null };
export type FilterValue =
  | string
  | number
  | boolean
  | string[]
  | DateRangeValue
  | NumberRangeValue
  | null
  | undefined;

export interface TableQuery {
  page: number;
  pageSize: number;
  sorting?: TableSort[];
  filters?: Record<string, FilterValue>;
  search?: string;
}

export interface FetchResult<T> {
  rows: T[];
  total: number;
}

export interface BulkAction<T> {
  id: string;
  label: string;
  icon?: ReactNode;
  variant?: 'primary' | 'default' | 'danger';
  onClick: (selectedRows: T[], clearSelection: () => void) => void;
}

export interface RowAction<T> {
  id: string;
  label: string;
  icon?: ReactNode;
  danger?: boolean;
  hidden?: (row: T) => boolean;
  disabled?: (row: T) => boolean;
  onClick: (row: T) => void;
}

export interface DrillDownConfig<T> {
  getChildren: (row: T, level: number) => Promise<unknown[]>;
  columnsByLevel: Record<number, ColumnConfig<unknown>[]>;
  hasChildren?: (row: T, level: number) => boolean;
  maxLevel?: number;
  persistExpansion?: boolean;
}

export interface DetailTab<T> {
  id: string;
  label: string;
  icon?: ReactNode;
  badge?: (row: T) => number | string;
  render: (row: T) => ReactNode;
  lazy?: boolean;
}

export type TableDensity = 'compact' | 'comfortable' | 'spacious';
export type ExportFormat = 'csv' | 'xlsx' | 'pdf';
export type ColumnPin = 'left' | 'right';
export type SelectionMode = 'none' | 'single' | 'multi';
export type PaginationMode = 'pages' | 'infinite';
export type DetailMode = 'inline' | 'drawer' | 'modal' | 'route';

export interface DataTableProps<T> {
  id: string;
  columns: ColumnConfig<T>[];
  mode: 'client' | 'server';
  data?: T[];
  fetchData?: (q: TableQuery) => Promise<FetchResult<T>>;
  getRowId: RowIdGetter<T>;
  selection?: SelectionMode;
  bulkActions?: BulkAction<T>[];
  rowActions?: RowAction<T>[];
  drillDown?: DrillDownConfig<T>;
  detailTabs?: DetailTab<T>[];
  detailMode?: DetailMode;
  virtualized?: boolean;
  syncToUrl?: boolean;
  exportable?: ExportFormat[];
  pagination?: PaginationMode;
}

export interface TableState {
  page: number;
  pageSize: number;
  sorting: TableSort[];
  filters: Record<string, FilterValue>;
  search: string;
}

export type ColumnPinMap = Record<string, ColumnPin | undefined>;
