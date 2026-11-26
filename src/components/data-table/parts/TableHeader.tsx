import { useRef, useState } from 'react';
import { ArrowDown, ArrowUp, ArrowUpDown, GripVertical, Pin, PinOff } from 'lucide-react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { cn } from '@/lib/utils';
import type { ColumnConfig, TableSort } from '../types';
import { getStickyLeft, getStickyRight, SELECT_COL_WIDTH } from '../utils/pinning';

interface TableHeaderCellProps<T> {
  column: ColumnConfig<T>;
  sorting: TableSort[];
  onSort: (columnId: string, multi: boolean) => void;
  onResize: (columnId: string, newWidth: number) => void;
  onTogglePin?: (columnId: string) => void;
  width?: number;
  left?: number;
  right?: number;
}

export function SortableHeaderCell<T>({
  column,
  sorting,
  onSort,
  onResize,
  onTogglePin,
  width,
  left,
  right,
}: TableHeaderCellProps<T>) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: column.id,
  });
  const [resizing, setResizing] = useState(false);
  const startXRef = useRef(0);
  const startWidthRef = useRef(0);
  const sortIndex = sorting.findIndex((s) => s.id === column.id);
  const currentSort = sortIndex !== -1 ? sorting[sortIndex] : null;
  const headerTitle = typeof column.header === 'string' ? column.header : column.header({ column });

  const handleResizeStart = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    setResizing(true);
    startXRef.current = e.clientX;
    startWidthRef.current = width || column.width || 150;
    const handleMouseMove = (moveEvent: MouseEvent) => {
      const delta = moveEvent.clientX - startXRef.current;
      const minW = column.minWidth || 60;
      const maxW = column.maxWidth || 800;
      onResize(column.id, Math.max(minW, Math.min(maxW, startWidthRef.current + delta)));
    };
    const handleMouseUp = () => {
      setResizing(false);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
  };

  return (
    <th
      ref={setNodeRef}
      scope="col"
      style={{
        transform: CSS.Translate.toString(transform),
        transition,
        width: width || column.width || undefined,
        minWidth: column.minWidth || 60,
        maxWidth: column.maxWidth || undefined,
        left,
        right,
      }}
      className={cn(
        'group relative select-none px-3 py-2.5 text-left text-xs font-bold uppercase tracking-wider text-muted border-b border-border bg-surface',
        isDragging && 'opacity-50 z-30',
        column.sortable !== false && 'cursor-pointer hover:text-foreground hover:bg-surface-hover',
        column.pinned && 'sticky z-10 shadow-xs',
      )}
      onClick={(e) => {
        if (column.sortable !== false && !resizing) onSort(column.id, e.shiftKey);
      }}
    >
      <div className="flex items-center justify-between gap-1.5">
        <div className="flex items-center gap-1.5 min-w-0">
          <button
            type="button"
            className="cursor-grab text-muted/40 hover:text-foreground opacity-0 group-hover:opacity-100"
            {...attributes}
            {...listeners}
            onClick={(e) => e.stopPropagation()}
            title="Drag to reorder"
            aria-label={`Reorder ${String(headerTitle)}`}
          >
            <GripVertical className="h-3.5 w-3.5" />
          </button>
          <span className="truncate">{headerTitle}</span>
        </div>
        <div className="flex items-center gap-1 shrink-0">
          {onTogglePin && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onTogglePin(column.id);
              }}
              className="text-muted/40 hover:text-primary opacity-0 group-hover:opacity-100 p-0.5 rounded"
              title={column.pinned ? 'Unpin column' : 'Pin column'}
            >
              {column.pinned ? (
                <PinOff className="h-3 w-3 text-primary" />
              ) : (
                <Pin className="h-3 w-3" />
              )}
            </button>
          )}
          {column.sortable !== false && (
            <span className="inline-flex items-center">
              {currentSort ? (
                currentSort.desc ? (
                  <ArrowDown className="h-3.5 w-3.5 text-primary" />
                ) : (
                  <ArrowUp className="h-3.5 w-3.5 text-primary" />
                )
              ) : (
                <ArrowUpDown className="h-3.5 w-3.5 text-muted/40 opacity-0 group-hover:opacity-100" />
              )}
              {sorting.length > 1 && sortIndex !== -1 && (
                <span className="text-[10px] font-bold text-primary ml-0.5">{sortIndex + 1}</span>
              )}
            </span>
          )}
        </div>
      </div>
      <div
        onMouseDown={handleResizeStart}
        onClick={(e) => e.stopPropagation()}
        className={cn(
          'absolute right-0 top-0 h-full w-1.5 cursor-col-resize hover:bg-primary/50',
          resizing && 'bg-primary w-2',
        )}
      />
    </th>
  );
}

interface TableHeaderProps<T> {
  columns: ColumnConfig<T>[];
  sorting: TableSort[];
  onSort: (columnId: string, multi: boolean) => void;
  onResizeColumn: (columnId: string, newWidth: number) => void;
  onTogglePin?: (columnId: string) => void;
  columnWidths: Record<string, number>;
  selection?: 'none' | 'single' | 'multi';
  isAllPageSelected: boolean;
  onToggleSelectAll: () => void;
  hasRowActions?: boolean;
}

export function TableHeader<T>({
  columns,
  sorting,
  onSort,
  onResizeColumn,
  onTogglePin,
  columnWidths,
  selection = 'none',
  isAllPageSelected,
  onToggleSelectAll,
  hasRowActions,
}: TableHeaderProps<T>) {
  const hasSelection = selection !== 'none';
  return (
    <thead className="sticky top-0 z-20 bg-surface shadow-xs">
      <tr>
        {hasSelection && (
          <th
            className="px-3 py-2.5 text-center border-b border-border bg-surface sticky left-0 z-20"
            style={{ width: SELECT_COL_WIDTH, minWidth: SELECT_COL_WIDTH }}
          >
            {selection === 'multi' && (
              <input
                type="checkbox"
                checked={isAllPageSelected && columns.length > 0}
                onChange={onToggleSelectAll}
                className="h-4 w-4 rounded border-border text-primary focus:ring-primary cursor-pointer"
                title="Select all on this page"
                aria-label="Select all on this page"
              />
            )}
          </th>
        )}
        {columns.map((col) => (
          <SortableHeaderCell
            key={col.id}
            column={col}
            sorting={sorting}
            onSort={onSort}
            onResize={onResizeColumn}
            onTogglePin={onTogglePin}
            width={columnWidths[col.id]}
            left={getStickyLeft(columns, col.id, columnWidths, hasSelection)}
            right={getStickyRight(columns, col.id, columnWidths, Boolean(hasRowActions))}
          />
        ))}
        {hasRowActions && (
          <th className="w-12 px-3 py-2.5 text-right border-b border-border bg-surface text-xs font-bold uppercase tracking-wider text-muted sticky right-0 z-20">
            Actions
          </th>
        )}
      </tr>
    </thead>
  );
}
