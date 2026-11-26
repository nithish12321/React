import { useEffect, useRef, useState } from 'react';
import { MoreHorizontal } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { ColumnConfig, RowAction, TableDensity } from '../types';
import { getColumnValue } from '../utils/sorting';
import { renderCell } from '../renderers/cellRenderers';
import { getStickyLeft, getStickyRight, SELECT_COL_WIDTH } from '../utils/pinning';

interface TableRowProps<T> {
  row: T;
  rowId: string;
  columns: ColumnConfig<T>[];
  index: number;
  density: TableDensity;
  striped?: boolean;
  selection?: 'none' | 'single' | 'multi';
  isSelected?: boolean;
  onToggleSelect?: () => void;
  rowActions?: RowAction<T>[];
  columnWidths: Record<string, number>;
  style?: React.CSSProperties;
}

export function TableRow<T>({
  row,
  rowId,
  columns,
  index,
  density,
  striped = true,
  selection = 'none',
  isSelected = false,
  onToggleSelect,
  rowActions = [],
  columnWidths,
  style,
}: TableRowProps<T>) {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) setMenuOpen(false);
    }
    if (menuOpen) document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [menuOpen]);

  const densityPadding =
    density === 'compact' ? 'py-1 px-3' : density === 'spacious' ? 'py-3.5 px-3' : 'py-2 px-3';
  const visibleActions = rowActions.filter((a) => !a.hidden || !a.hidden(row));
  const hasSelection = selection !== 'none';

  return (
    <tr
      style={style}
      data-row-id={rowId}
      className={cn(
        'border-b border-border/60 transition-colors',
        striped && index % 2 === 1 ? 'bg-muted-surface/20' : 'bg-surface',
        isSelected ? 'bg-primary/10 hover:bg-primary/15' : 'hover:bg-surface-hover/80',
      )}
    >
      {hasSelection && (
        <td
          className={cn('text-center sticky left-0 z-10 bg-inherit', densityPadding)}
          style={{ width: SELECT_COL_WIDTH }}
        >
          <input
            type={selection === 'single' ? 'radio' : 'checkbox'}
            checked={isSelected}
            onChange={onToggleSelect}
            className="h-4 w-4 rounded border-border text-primary focus:ring-primary cursor-pointer"
            aria-label={`Select row ${rowId}`}
          />
        </td>
      )}
      {columns.map((col) => {
        const val = getColumnValue(row, col);
        const left = getStickyLeft(columns, col.id, columnWidths, hasSelection);
        const right = getStickyRight(columns, col.id, columnWidths, rowActions.length > 0);
        return (
          <td
            key={col.id}
            className={cn(
              'text-xs text-foreground align-middle',
              densityPadding,
              col.pinned && 'sticky z-10 bg-inherit shadow-xs',
            )}
            style={{
              width: columnWidths[col.id] ?? col.width,
              left,
              right,
            }}
          >
            {renderCell(row, col, val)}
          </td>
        );
      })}
      {rowActions.length > 0 && (
        <td className={cn('w-12 text-right sticky right-0 z-10 bg-inherit', densityPadding)}>
          <div className="relative inline-block" ref={menuRef}>
            <button
              type="button"
              onClick={() => setMenuOpen((prev) => !prev)}
              className="rounded-lg p-1 text-muted hover:text-foreground hover:bg-surface-hover"
              title="Row actions"
              aria-haspopup="menu"
              aria-expanded={menuOpen}
            >
              <MoreHorizontal className="h-4 w-4" />
            </button>
            {menuOpen && visibleActions.length > 0 && (
              <div
                role="menu"
                className="absolute right-0 top-full mt-1 z-40 w-40 rounded-xl border border-border bg-surface p-1 shadow-medium"
              >
                {visibleActions.map((act) => {
                  const isDisabled = Boolean(act.disabled?.(row));
                  return (
                    <button
                      key={act.id}
                      type="button"
                      role="menuitem"
                      disabled={isDisabled}
                      onClick={() => {
                        setMenuOpen(false);
                        act.onClick(row);
                      }}
                      className={cn(
                        'flex w-full items-center gap-2 rounded-lg px-2.5 py-1.5 text-xs font-medium text-left',
                        act.danger
                          ? 'text-danger hover:bg-danger/10'
                          : 'text-foreground hover:bg-surface-hover',
                        isDisabled && 'opacity-40 cursor-not-allowed',
                      )}
                    >
                      {act.icon}
                      <span>{act.label}</span>
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </td>
      )}
    </tr>
  );
}
