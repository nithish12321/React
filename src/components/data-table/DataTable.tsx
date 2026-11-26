import { useMemo, useRef, useState } from 'react';
import {
  DndContext,
  PointerSensor,
  closestCenter,
  useSensor,
  useSensors,
  type DragEndEvent,
} from '@dnd-kit/core';
import { SortableContext, horizontalListSortingStrategy } from '@dnd-kit/sortable';
import { TableHeader } from './parts/TableHeader';
import { TableToolbar } from './parts/TableToolbar';
import { TablePagination } from './parts/TablePagination';
import { FilterChips } from './parts/FilterChips';
import { BulkActionBar } from './parts/BulkActionBar';
import { TableBody } from './parts/TableBody';
import { TableEmpty, TableError, TableSkeleton } from './parts/TableStates';
import { useTableExport } from './hooks/useTableExport';
import { useVirtualRows } from './hooks/useVirtualRows';
import { useColumnLayout } from './hooks/useColumnLayout';
import { useTableController } from './hooks/useTableController';
import type { DataTableProps, TableDensity } from './types';

export function DataTable<T>({
  id,
  columns,
  mode,
  data = [],
  fetchData,
  getRowId,
  selection = 'none',
  bulkActions,
  rowActions,
  virtualized = false,
  syncToUrl = false,
  exportable = [],
  pagination = 'pages',
}: DataTableProps<T>) {
  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 6 } }));
  const controller = useTableController({
    id,
    columns,
    mode,
    data,
    fetchData,
    getRowId,
    pagination,
    syncToUrl,
  });
  const layout = useColumnLayout(columns);
  const [density, setDensity] = useState<TableDensity>(controller.densityDefault);
  const [selected, setSelected] = useState<Map<string, T>>(new Map());
  const containerRef = useRef<HTMLDivElement>(null);
  const exportFn = useTableExport(id);
  const estimate = density === 'compact' ? 36 : density === 'spacious' ? 56 : 44;
  const { virtualItems, totalSize } = useVirtualRows(
    controller.rows,
    containerRef,
    virtualized,
    estimate,
  );

  const selectedIds = useMemo(() => new Set(selected.keys()), [selected]);
  const isAllPageSelected =
    controller.rows.length > 0 && controller.rows.every((row) => selectedIds.has(getRowId(row)));

  const toggleRow = (row: T) => {
    const key = getRowId(row);
    setSelected((prev) => {
      if (selection === 'single') {
        if (prev.has(key)) return new Map();
        return new Map([[key, row]]);
      }
      const next = new Map(prev);
      if (next.has(key)) next.delete(key);
      else next.set(key, row);
      return next;
    });
  };

  const toggleSelectAllPage = () => {
    setSelected((prev) => {
      const next = new Map(prev);
      if (isAllPageSelected) controller.rows.forEach((r) => next.delete(getRowId(r)));
      else controller.rows.forEach((r) => next.set(getRowId(r), r));
      return next;
    });
  };

  const selectAllAcrossPages = async () => {
    if (mode === 'client') {
      setSelected(new Map(controller.allFilteredRows.map((r) => [getRowId(r), r])));
      return;
    }
    if (!fetchData) return;
    const res = await fetchData({
      ...controller.query,
      page: 1,
      pageSize: Math.max(controller.total, 1),
    });
    setSelected(new Map(res.rows.map((r) => [getRowId(r), r])));
  };

  const onDragEnd = (event: DragEndEvent) => {
    if (event.over) layout.reorder(String(event.active.id), String(event.over.id));
  };

  const colSpan =
    layout.visibleColumns.length + (selection !== 'none' ? 1 : 0) + (rowActions?.length ? 1 : 0);

  return (
    <div
      className="flex flex-col w-full rounded-xl border border-border bg-surface overflow-hidden"
      data-table-id={id}
    >
      <TableToolbar
        search={controller.tableState.search}
        onSearchChange={controller.handleSearchChange}
        columns={columns}
        visibleColumnIds={layout.visibleColumns.map((c) => c.id)}
        onToggleColumn={layout.toggleColumn}
        onResetColumns={layout.resetColumns}
        filters={controller.tableState.filters}
        onFilterChange={controller.handleFilterChange}
        density={density}
        onDensityChange={setDensity}
        exportable={exportable}
        selectedCount={selected.size}
        onExport={(format, scope) => {
          const rows = scope === 'selected' ? Array.from(selected.values()) : controller.rows;
          exportFn(rows, layout.visibleColumns, format);
        }}
      />
      <div className="px-3">
        <FilterChips
          search={controller.tableState.search}
          onClearSearch={() => controller.handleSearchChange('')}
          filters={controller.tableState.filters}
          columns={columns}
          onRemoveFilter={(colId) => controller.handleFilterChange(colId, undefined)}
          onClearAll={controller.clearFilters}
        />
      </div>
      <div
        ref={containerRef}
        className="relative overflow-auto"
        style={{ maxHeight: virtualized ? '32rem' : undefined }}
      >
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={onDragEnd}>
          <table className="w-full border-collapse">
            <SortableContext
              items={layout.visibleColumns.map((c) => c.id)}
              strategy={horizontalListSortingStrategy}
            >
              <TableHeader
                columns={layout.visibleColumns}
                sorting={controller.tableState.sorting}
                onSort={controller.handleSort}
                onResizeColumn={layout.resizeColumn}
                onTogglePin={layout.togglePin}
                columnWidths={layout.widths}
                selection={selection}
                isAllPageSelected={isAllPageSelected}
                onToggleSelectAll={toggleSelectAllPage}
                hasRowActions={Boolean(rowActions?.length)}
              />
            </SortableContext>
            {controller.loading && controller.rows.length === 0 ? (
              <tbody>
                <tr>
                  <td colSpan={colSpan}>
                    <TableSkeleton rows={controller.tableState.pageSize} cols={columns.length} />
                  </td>
                </tr>
              </tbody>
            ) : controller.error && controller.rows.length === 0 ? (
              <tbody>
                <tr>
                  <td colSpan={colSpan}>
                    <TableError message={controller.error} onRetry={controller.retry} />
                  </td>
                </tr>
              </tbody>
            ) : controller.rows.length === 0 ? (
              <tbody>
                <tr>
                  <td colSpan={colSpan}>
                    <TableEmpty onClear={controller.clearFilters} />
                  </td>
                </tr>
              </tbody>
            ) : (
              <TableBody
                rows={controller.rows}
                getRowId={getRowId}
                columns={layout.visibleColumns}
                density={density}
                striped={controller.stripedDefault}
                selection={selection}
                selectedIds={selectedIds}
                onToggleRow={toggleRow}
                rowActions={rowActions}
                columnWidths={layout.widths}
                virtualized={virtualized}
                virtualItems={virtualItems}
                totalSize={totalSize}
              />
            )}
          </table>
        </DndContext>
        {controller.loading && controller.rows.length > 0 && (
          <div className="absolute inset-0 flex items-center justify-center bg-surface/70 text-xs text-muted">
            Loading…
          </div>
        )}
      </div>
      {pagination === 'pages' && (
        <TablePagination
          page={controller.tableState.page}
          pageSize={controller.tableState.pageSize}
          totalPages={controller.totalPages}
          total={controller.total}
          startIndex={controller.startIndex}
          endIndex={controller.endIndex}
          onPageChange={controller.handlePageChange}
          onPageSizeChange={controller.handlePageSizeChange}
        />
      )}
      {pagination === 'infinite' && controller.rows.length < controller.total && (
        <div className="flex justify-center border-t border-border p-3">
          <button
            type="button"
            onClick={controller.loadMore}
            disabled={controller.loading}
            className="rounded-lg border border-border bg-surface px-4 py-1.5 text-xs font-semibold hover:bg-surface-hover disabled:opacity-40"
          >
            {controller.loading ? 'Loading…' : 'Load more'}
          </button>
        </div>
      )}
      <BulkActionBar
        selectedCount={selected.size}
        totalCount={controller.total}
        isAllSelectedAcrossPages={selected.size === controller.total && controller.total > 0}
        onSelectAllAcrossPages={() => void selectAllAcrossPages()}
        onClearSelection={() => setSelected(new Map())}
        bulkActions={bulkActions}
        selectedRows={Array.from(selected.values())}
      />
    </div>
  );
}
