import { useCallback, useMemo, useState } from 'react';
import type { ColumnConfig, ColumnPin, ColumnPinMap } from '../types';

export function useColumnLayout<T>(columns: ColumnConfig<T>[]) {
  const [visibility, setVisibility] = useState<Record<string, boolean>>(() =>
    Object.fromEntries(columns.map((c) => [c.id, true])),
  );
  const [order, setOrder] = useState<string[]>(() => columns.map((c) => c.id));
  const [widths, setWidths] = useState<Record<string, number>>({});
  const [pins, setPins] = useState<ColumnPinMap>(() =>
    Object.fromEntries(columns.map((c) => [c.id, c.pinned])),
  );

  const toggleColumn = useCallback((colId: string) => {
    setVisibility((prev) => {
      const nextVisible = !prev[colId];
      const visibleCount = Object.values(prev).filter(Boolean).length;
      if (!nextVisible && visibleCount <= 1) return prev;
      return { ...prev, [colId]: nextVisible };
    });
  }, []);

  const resetColumns = useCallback(() => {
    setVisibility(Object.fromEntries(columns.map((c) => [c.id, true])));
    setOrder(columns.map((c) => c.id));
    setWidths({});
    setPins(Object.fromEntries(columns.map((c) => [c.id, c.pinned])));
  }, [columns]);

  const resizeColumn = useCallback((colId: string, width: number) => {
    setWidths((prev) => ({ ...prev, [colId]: width }));
  }, []);

  const togglePin = useCallback((colId: string) => {
    setPins((prev) => {
      const current = prev[colId];
      const next: ColumnPin | undefined =
        current === 'left' ? 'right' : current === 'right' ? undefined : 'left';
      return { ...prev, [colId]: next };
    });
  }, []);

  const reorder = useCallback((activeId: string, overId: string) => {
    setOrder((prev) => {
      const from = prev.indexOf(activeId);
      const to = prev.indexOf(overId);
      if (from < 0 || to < 0 || from === to) return prev;
      const next = [...prev];
      next.splice(from, 1);
      next.splice(to, 0, activeId);
      return next;
    });
  }, []);

  const visibleColumns = useMemo(() => {
    const byId = new Map(columns.map((c) => [c.id, c]));
    const ordered = order.map((id) => byId.get(id)).filter((c): c is ColumnConfig<T> => Boolean(c));
    const extras = columns.filter((c) => !order.includes(c.id));
    const all = [...ordered, ...extras].filter((c) => visibility[c.id] !== false);
    const withPin = all.map((c) => ({ ...c, pinned: pins[c.id] }));
    const left = withPin.filter((c) => c.pinned === 'left');
    const right = withPin.filter((c) => c.pinned === 'right');
    const mid = withPin.filter((c) => !c.pinned);
    return [...left, ...mid, ...right];
  }, [columns, order, pins, visibility]);

  return {
    visibility,
    order,
    widths,
    pins,
    visibleColumns,
    toggleColumn,
    resetColumns,
    resizeColumn,
    togglePin,
    reorder,
  };
}
