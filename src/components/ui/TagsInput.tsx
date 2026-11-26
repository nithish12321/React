import { useState, type KeyboardEvent } from 'react';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface TagsInputProps {
  label?: string;
  helperText?: string;
  errorText?: string;
  value: string[];
  onChange: (tags: string[]) => void;
  placeholder?: string;
  maxTags?: number;
  disabled?: boolean;
  className?: string;
}

export function TagsInput({
  label,
  helperText,
  errorText,
  value = [],
  onChange,
  placeholder = 'Type and press Enter…',
  maxTags = 10,
  disabled = false,
  className,
}: TagsInputProps) {
  const [input, setInput] = useState('');

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      const trimmed = input.trim();
      if (trimmed && !value.includes(trimmed) && value.length < maxTags) {
        onChange([...value, trimmed]);
        setInput('');
      }
    } else if (e.key === 'Backspace' && !input && value.length > 0) {
      onChange(value.slice(0, -1));
    }
  };

  const removeTag = (index: number) => {
    onChange(value.filter((_, i) => i !== index));
  };

  return (
    <div className={cn('w-full flex flex-col gap-1', className)}>
      <div className="flex items-center justify-between">
        {label && <label className="text-xs font-medium text-foreground">{label}</label>}
        <span className="text-[10px] text-muted">
          {value.length} / {maxTags} tags
        </span>
      </div>

      <div
        className={cn(
          'flex min-h-9 w-full flex-wrap items-center gap-1.5 rounded-md border border-border bg-surface px-2.5 py-1.5 text-xs text-foreground shadow-soft transition-all',
          'focus-within:outline-none focus-within:ring-2 focus-within:ring-ring focus-within:border-primary',
          disabled && 'opacity-50 cursor-not-allowed bg-muted-surface',
          errorText && 'border-danger focus-within:ring-danger text-danger',
        )}
      >
        {value.map((tag, idx) => (
          <span
            key={tag}
            className="inline-flex items-center gap-1 rounded bg-muted-surface border border-border px-2 py-0.5 text-xs font-medium text-foreground"
          >
            <span>{tag}</span>
            {!disabled && (
              <button
                type="button"
                onClick={() => removeTag(idx)}
                className="text-muted hover:text-danger rounded"
                aria-label={`Remove tag ${tag}`}
              >
                <X className="h-3 w-3" />
              </button>
            )}
          </span>
        ))}

        {value.length < maxTags && (
          <input
            type="text"
            value={input}
            disabled={disabled}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={value.length === 0 ? placeholder : ''}
            className="flex-1 min-w-[80px] bg-transparent text-xs text-foreground placeholder:text-muted focus:outline-none disabled:cursor-not-allowed"
          />
        )}
      </div>

      {errorText ? (
        <p className="text-[11px] text-danger">{errorText}</p>
      ) : helperText ? (
        <p className="text-[11px] text-muted">{helperText}</p>
      ) : null}
    </div>
  );
}
