import { Plus, Trash2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from './Button';

export interface DynamicFieldItem {
  id: string;
  key: string;
  value: string;
}

export interface DynamicFieldArrayProps {
  label?: string;
  helperText?: string;
  items: DynamicFieldItem[];
  onChange: (items: DynamicFieldItem[]) => void;
  maxItems?: number;
  disabled?: boolean;
  className?: string;
}

export function DynamicFieldArray({
  label = 'Custom Attributes',
  helperText,
  items,
  onChange,
  maxItems = 8,
  disabled = false,
  className,
}: DynamicFieldArrayProps) {
  const addItem = () => {
    if (items.length < maxItems) {
      onChange([...items, { id: crypto.randomUUID(), key: '', value: '' }]);
    }
  };

  const removeItem = (id: string) => {
    onChange(items.filter((item) => item.id !== id));
  };

  const updateItem = (id: string, field: 'key' | 'value', val: string) => {
    onChange(items.map((item) => (item.id === id ? { ...item, [field]: val } : item)));
  };

  return (
    <div className={cn('w-full flex flex-col gap-2', className)}>
      <div className="flex items-center justify-between">
        {label && <label className="text-xs font-medium text-foreground">{label}</label>}
        <span className="text-[10px] text-muted">
          {items.length} / {maxItems}
        </span>
      </div>

      <div className="space-y-2">
        {items.map((item, index) => (
          <div key={item.id} className="flex items-center gap-2">
            <input
              type="text"
              value={item.key}
              disabled={disabled}
              onChange={(e) => updateItem(item.id, 'key', e.target.value)}
              placeholder={`Key #${index + 1}`}
              className="w-1/3 rounded-md border border-border bg-surface px-2.5 py-1.5 text-xs text-foreground placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-ring"
            />
            <input
              type="text"
              value={item.value}
              disabled={disabled}
              onChange={(e) => updateItem(item.id, 'value', e.target.value)}
              placeholder="Value"
              className="flex-1 rounded-md border border-border bg-surface px-2.5 py-1.5 text-xs text-foreground placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-ring"
            />
            <button
              type="button"
              disabled={disabled}
              onClick={() => removeItem(item.id)}
              className="rounded p-1.5 text-muted hover:text-danger hover:bg-muted-surface"
              aria-label="Remove item"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        ))}

        {items.length < maxItems && (
          <Button
            type="button"
            variant="outline"
            size="sm"
            disabled={disabled}
            onClick={addItem}
            prefixIcon={<Plus className="h-3.5 w-3.5" />}
          >
            Add Attribute
          </Button>
        )}
      </div>

      {helperText && <p className="text-[11px] text-muted">{helperText}</p>}
    </div>
  );
}
