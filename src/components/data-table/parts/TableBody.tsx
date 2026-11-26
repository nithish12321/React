import type { VirtualItem } from '@tanstack/react-virtual';
import type { ColumnConfig, RowAction, SelectionMode, TableDensity } from '../types';
import { TableRow } from './TableRow';

interface TableBodyProps<T> {
  rows: T[];
  getRowId: (row: T) => string;
  columns: ColumnConfig<T>[];
  density: TableDensity;
  striped: boolean;
  selection: SelectionMode;
  selectedIds: Set<string>;
  onToggleRow: (row: T) => void;
  rowActions?: RowAction<T>[];
  columnWidths: Record<string, number>;
  virtualized: boolean;
  virtualItems: VirtualItem[];
  totalSize: number;
}

export function TableBody<T>({
  rows,
  getRowId,
  columns,
  density,
  striped,
  selection,
  selectedIds,
  onToggleRow,
  rowActions,
  columnWidths,
  virtualized,
  virtualItems,
  totalSize,
}: TableBodyProps<T>) {
  if (virtualized) {
    const first = virtualItems[0];
    const last = virtualItems[virtualItems.length - 1];
    const padTop = first?.start ?? 0;
    const padBottom = last ? Math.max(0, totalSize - last.end) : 0;
    return (
      <tbody>
        {padTop > 0 && (
          <tr aria-hidden>
            <td colSpan={99} style={{ height: padTop, padding: 0, border: 0 }} />
          </tr>
        )}
        {virtualItems.map((item) => {
          const row = rows[item.index];
          if (!row) return null;
          const id = getRowId(row);
          return (
            <TableRow
              key={id}
              row={row}
              rowId={id}
              columns={columns}
              index={item.index}
              density={density}
              striped={striped}
              selection={selection}
              isSelected={selectedIds.has(id)}
              onToggleSelect={() => onToggleRow(row)}
              rowActions={rowActions}
              columnWidths={columnWidths}
            />
          );
        })}
        {padBottom > 0 && (
          <tr aria-hidden>
            <td colSpan={99} style={{ height: padBottom, padding: 0, border: 0 }} />
          </tr>
        )}
      </tbody>
    );
  }

  return (
    <tbody>
      {rows.map((row, idx) => {
        const id = getRowId(row);
        return (
          <TableRow
            key={id}
            row={row}
            rowId={id}
            columns={columns}
            index={idx}
            density={density}
            striped={striped}
            selection={selection}
            isSelected={selectedIds.has(id)}
            onToggleSelect={() => onToggleRow(row)}
            rowActions={rowActions}
            columnWidths={columnWidths}
          />
        );
      })}
    </tbody>
  );
}
