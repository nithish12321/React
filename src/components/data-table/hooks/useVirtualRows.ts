import { useVirtualizer } from '@tanstack/react-virtual';
import type { RefObject } from 'react';

export function useVirtualRows<T>(
  rows: T[],
  containerRef: RefObject<HTMLDivElement | null>,
  enabled = true,
  estimateSize = 44,
) {
  const virtualizer = useVirtualizer({
    count: enabled ? rows.length : 0,
    getScrollElement: () => containerRef.current,
    estimateSize: () => estimateSize,
    overscan: 8,
    enabled,
  });

  return {
    virtualizer,
    virtualItems: enabled ? virtualizer.getVirtualItems() : [],
    totalSize: enabled ? virtualizer.getTotalSize() : 0,
  };
}
