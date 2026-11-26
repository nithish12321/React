import type { ColumnConfig } from '../types';

export const SELECT_COL_WIDTH = 40;
export const ACTIONS_COL_WIDTH = 48;

export function getStickyLeft<T>(
  columns: ColumnConfig<T>[],
  columnId: string,
  widths: Record<string, number>,
  hasSelection: boolean,
): number | undefined {
  const col = columns.find((c) => c.id === columnId);
  if (col?.pinned !== 'left') return undefined;
  let left = hasSelection ? SELECT_COL_WIDTH : 0;
  for (const c of columns) {
    if (c.pinned !== 'left') continue;
    if (c.id === columnId) break;
    left += widths[c.id] ?? c.width ?? 140;
  }
  return left;
}

export function getStickyRight<T>(
  columns: ColumnConfig<T>[],
  columnId: string,
  widths: Record<string, number>,
  hasActions: boolean,
): number | undefined {
  const col = columns.find((c) => c.id === columnId);
  if (col?.pinned !== 'right') return undefined;
  let right = hasActions ? ACTIONS_COL_WIDTH : 0;
  const rightCols = columns.filter((c) => c.pinned === 'right');
  for (let i = rightCols.length - 1; i >= 0; i--) {
    const c = rightCols[i];
    if (c.id === columnId) break;
    right += widths[c.id] ?? c.width ?? 140;
  }
  return right;
}
