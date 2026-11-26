import { useState } from 'react';
import { Check, X } from 'lucide-react';
import type { ColumnConfig } from '../types';

export function InlineEditCell<T>({
  row,
  column,
  value,
}: {
  row: T;
  column: ColumnConfig<T>;
  value: unknown;
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [draft, setDraft] = useState(String(value ?? ''));

  const handleSave = async () => {
    setIsEditing(false);
    if (draft !== String(value ?? '') && column.onEdit) {
      await column.onEdit(row, draft);
    }
  };

  if (!column.editable) {
    return <span className="text-sm text-foreground">{String(value ?? '')}</span>;
  }

  if (isEditing) {
    return (
      <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
        <input
          type="text"
          value={draft}
          autoFocus
          aria-label="Edit cell"
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') void handleSave();
            if (e.key === 'Escape') {
              setDraft(String(value ?? ''));
              setIsEditing(false);
            }
          }}
          className="h-7 w-full rounded border border-primary bg-surface px-2 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
        />
        <button type="button" onClick={() => void handleSave()} className="rounded p-1 text-success hover:bg-success/10">
          <Check className="h-3.5 w-3.5" />
        </button>
        <button
          type="button"
          onClick={() => {
            setDraft(String(value ?? ''));
            setIsEditing(false);
          }}
          className="rounded p-1 text-muted hover:bg-surface-hover"
        >
          <X className="h-3.5 w-3.5" />
        </button>
      </div>
    );
  }

  return (
    <div
      onClick={() => setIsEditing(true)}
      className="group flex cursor-pointer items-center justify-between gap-2 rounded px-1.5 py-1 -mx-1.5 -my-1 hover:bg-surface-hover"
      title="Click to edit"
    >
      <span className="text-sm text-foreground">{String(value ?? '')}</span>
      <span className="opacity-0 group-hover:opacity-100 text-[10px] text-primary font-medium">
        Edit
      </span>
    </div>
  );
}
