import { X, CheckSquare } from 'lucide-react';
import type { BulkAction } from '../types';

interface BulkActionBarProps<T> {
  selectedCount: number;
  totalCount: number;
  isAllSelectedAcrossPages: boolean;
  onSelectAllAcrossPages: () => void;
  onClearSelection: () => void;
  bulkActions?: BulkAction<T>[];
  selectedRows: T[];
}

export function BulkActionBar<T>({
  selectedCount,
  totalCount,
  isAllSelectedAcrossPages,
  onSelectAllAcrossPages,
  onClearSelection,
  bulkActions = [],
  selectedRows,
}: BulkActionBarProps<T>) {
  if (selectedCount === 0) return null;

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-3 rounded-2xl border border-primary/30 bg-surface/95 px-5 py-2.5 shadow-strong backdrop-blur-md animate-in slide-in-from-bottom-4 duration-200">
      <div className="flex items-center gap-2 pr-2 border-r border-border">
        <CheckSquare className="h-4 w-4 text-primary" />
        <span className="text-xs font-bold text-foreground">
          {isAllSelectedAcrossPages ? `All ${totalCount} selected` : `${selectedCount} selected`}
        </span>
      </div>

      {!isAllSelectedAcrossPages && totalCount > selectedCount && (
        <button
          type="button"
          onClick={onSelectAllAcrossPages}
          className="text-xs font-medium text-primary hover:underline hover:text-primary-hover"
        >
          Select all {totalCount}
        </button>
      )}

      <div className="flex items-center gap-1.5">
        {bulkActions.map((action) => {
          let btnStyle = 'bg-surface hover:bg-surface-hover text-foreground border-border';
          if (action.variant === 'primary') {
            btnStyle =
              'bg-primary hover:bg-primary-hover text-primary-foreground border-transparent';
          } else if (action.variant === 'danger') {
            btnStyle = 'bg-danger hover:bg-danger-hover text-primary-fg border-transparent';
          }

          return (
            <button
              key={action.id}
              type="button"
              onClick={() => action.onClick(selectedRows, onClearSelection)}
              className={`inline-flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-semibold shadow-xs transition-colors ${btnStyle}`}
            >
              {action.icon}
              <span>{action.label}</span>
            </button>
          );
        })}
      </div>

      <button
        type="button"
        onClick={onClearSelection}
        className="rounded-lg p-1.5 text-muted hover:text-foreground hover:bg-surface-hover transition-colors ml-1"
        title="Deselect all"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  );
}
