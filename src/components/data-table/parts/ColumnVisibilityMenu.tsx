import { useState, useRef, useEffect } from 'react';
import { Columns3, Check, RotateCcw } from 'lucide-react';
import type { ColumnConfig } from '../types';

interface ColumnVisibilityMenuProps<T> {
  columns: ColumnConfig<T>[];
  visibleColumnIds: string[];
  onToggleColumn: (colId: string) => void;
  onResetColumns: () => void;
}

export function ColumnVisibilityMenu<T>({
  columns,
  visibleColumnIds,
  onToggleColumn,
  onResetColumns,
}: ColumnVisibilityMenuProps<T>) {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    }
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  return (
    <div className="relative inline-block" ref={menuRef}>
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-surface px-3 py-1.5 text-xs font-semibold text-foreground hover:bg-surface-hover transition-colors shadow-xs"
        aria-haspopup="true"
        aria-expanded={isOpen}
      >
        <Columns3 className="h-3.5 w-3.5 text-muted" />
        <span>Columns</span>
      </button>

      {isOpen && (
        <div className="absolute right-0 top-full mt-1.5 z-40 w-56 rounded-xl border border-border bg-surface p-2 shadow-medium animate-in fade-in zoom-in-95">
          <div className="flex items-center justify-between border-b border-border pb-1.5 mb-1.5 px-2">
            <span className="text-xs font-semibold text-muted uppercase tracking-wider">
              Toggle Columns
            </span>
            <button
              type="button"
              onClick={onResetColumns}
              className="text-[11px] font-medium text-primary hover:underline flex items-center gap-1"
            >
              <RotateCcw className="h-3 w-3" />
              Reset
            </button>
          </div>

          <div className="max-h-60 overflow-y-auto space-y-0.5">
            {columns.map((col) => {
              const isVisible = visibleColumnIds.includes(col.id);
              const headerTitle = typeof col.header === 'string' ? col.header : col.id;
              const isOnlyOne = visibleColumnIds.length === 1 && isVisible;

              return (
                <label
                  key={col.id}
                  className={`flex items-center gap-2.5 rounded-lg px-2 py-1.5 text-xs font-medium cursor-pointer transition-colors ${
                    isOnlyOne
                      ? 'opacity-50 cursor-not-allowed text-muted'
                      : 'hover:bg-surface-hover text-foreground'
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={isVisible}
                    disabled={isOnlyOne}
                    onChange={() => onToggleColumn(col.id)}
                    className="h-3.5 w-3.5 rounded border-border text-primary focus:ring-primary"
                  />
                  <span className="flex-1 truncate">{headerTitle}</span>
                  {isVisible && <Check className="h-3 w-3 text-primary shrink-0" />}
                </label>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
