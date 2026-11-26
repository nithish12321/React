import { useEffect, useRef, useState } from 'react';
import { Search, X, Download, FileSpreadsheet, FileText, FileDown } from 'lucide-react';
import type { ColumnConfig, ExportFormat, FilterValue, TableDensity } from '../types';
import { ColumnVisibilityMenu } from './ColumnVisibilityMenu';
import { ColumnFiltersMenu } from './ColumnFiltersMenu';
import { cn } from '@/lib/utils';

interface TableToolbarProps<T> {
  search: string;
  onSearchChange: (val: string) => void;
  columns: ColumnConfig<T>[];
  visibleColumnIds: string[];
  onToggleColumn: (colId: string) => void;
  onResetColumns: () => void;
  filters: Record<string, FilterValue>;
  onFilterChange: (colId: string, val: FilterValue) => void;
  density: TableDensity;
  onDensityChange: (d: TableDensity) => void;
  exportable?: ExportFormat[];
  onExport?: (format: ExportFormat, scope: 'view' | 'selected') => void;
  selectedCount: number;
}

export function TableToolbar<T>({
  search,
  onSearchChange,
  columns,
  visibleColumnIds,
  onToggleColumn,
  onResetColumns,
  filters,
  onFilterChange,
  density,
  onDensityChange,
  exportable = [],
  onExport,
  selectedCount,
}: TableToolbarProps<T>) {
  const [exportOpen, setExportOpen] = useState(false);
  const exportRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onDoc(e: MouseEvent) {
      if (exportRef.current && !exportRef.current.contains(e.target as Node)) setExportOpen(false);
    }
    document.addEventListener('mousedown', onDoc);
    return () => document.removeEventListener('mousedown', onDoc);
  }, []);

  return (
    <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 p-3 border-b border-border bg-surface/50">
      <div className="relative flex-1 min-w-[200px] max-w-sm">
        <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted pointer-events-none" />
        <input
          type="search"
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search records..."
          className="h-8 w-full rounded-lg border border-border bg-surface pl-8 pr-8 text-xs text-foreground placeholder:text-muted focus:outline-none focus:ring-1 focus:ring-primary shadow-xs"
          aria-label="Search table"
        />
        {search && (
          <button
            type="button"
            onClick={() => onSearchChange('')}
            className="absolute right-2 top-1/2 -translate-y-1/2 text-muted hover:text-foreground p-0.5 rounded"
            title="Clear search"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        )}
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <ColumnFiltersMenu columns={columns} filters={filters} onFilterChange={onFilterChange} />

        <div className="inline-flex rounded-lg border border-border bg-surface p-0.5 shadow-xs">
          {(['compact', 'comfortable', 'spacious'] as TableDensity[]).map((d) => (
            <button
              key={d}
              type="button"
              onClick={() => onDensityChange(d)}
              className={cn(
                'rounded px-2 py-1 text-[11px] font-semibold capitalize transition-colors',
                density === d
                  ? 'bg-primary text-primary-fg shadow-xs'
                  : 'text-muted hover:text-foreground',
              )}
              title={`${d} density`}
            >
              {d === 'compact' ? 'Sm' : d === 'comfortable' ? 'Md' : 'Lg'}
            </button>
          ))}
        </div>

        <ColumnVisibilityMenu
          columns={columns}
          visibleColumnIds={visibleColumnIds}
          onToggleColumn={onToggleColumn}
          onResetColumns={onResetColumns}
        />

        {exportable.length > 0 && onExport && (
          <div className="relative" ref={exportRef}>
            <button
              type="button"
              onClick={() => setExportOpen((v) => !v)}
              className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-surface px-3 py-1.5 text-xs font-semibold text-foreground hover:bg-surface-hover transition-colors shadow-xs"
            >
              <Download className="h-3.5 w-3.5 text-muted" />
              Export
            </button>
            {exportOpen && (
              <ExportMenu
                formats={exportable}
                selectedCount={selectedCount}
                onPick={(format, scope) => {
                  onExport(format, scope);
                  setExportOpen(false);
                }}
              />
            )}
          </div>
        )}
      </div>
    </div>
  );
}

function ExportMenu({
  formats,
  selectedCount,
  onPick,
}: {
  formats: ExportFormat[];
  selectedCount: number;
  onPick: (format: ExportFormat, scope: 'view' | 'selected') => void;
}) {
  const items: { format: ExportFormat; label: string; icon: typeof FileText }[] = [];
  if (formats.includes('csv')) items.push({ format: 'csv', label: 'CSV', icon: FileText });
  if (formats.includes('xlsx'))
    items.push({ format: 'xlsx', label: 'Excel', icon: FileSpreadsheet });
  if (formats.includes('pdf')) items.push({ format: 'pdf', label: 'PDF', icon: FileDown });

  return (
    <div className="absolute right-0 top-full mt-1.5 z-40 w-48 rounded-xl border border-border bg-surface p-1 shadow-medium">
      {items.map((item) => (
        <div key={item.format} className="px-1 py-0.5">
          <button
            type="button"
            onClick={() => onPick(item.format, 'view')}
            className="flex w-full items-center gap-2 rounded-lg px-2.5 py-1.5 text-xs font-medium text-foreground hover:bg-surface-hover"
          >
            <item.icon className="h-3.5 w-3.5 text-primary" />
            {item.label} (view)
          </button>
          <button
            type="button"
            disabled={selectedCount === 0}
            onClick={() => onPick(item.format, 'selected')}
            className="flex w-full items-center gap-2 rounded-lg px-2.5 py-1.5 text-xs font-medium text-foreground hover:bg-surface-hover disabled:opacity-40"
          >
            <item.icon className="h-3.5 w-3.5 text-muted" />
            {item.label} (selected)
          </button>
        </div>
      ))}
    </div>
  );
}
