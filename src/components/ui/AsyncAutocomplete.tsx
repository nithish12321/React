import { useState, useEffect, useRef } from 'react';
import { Search, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface AutocompleteItem {
  id: string;
  title: string;
  subtitle?: string;
}

export interface AsyncAutocompleteProps {
  label?: string;
  helperText?: string;
  placeholder?: string;
  fetcher: (query: string) => Promise<AutocompleteItem[]>;
  onSelect: (item: AutocompleteItem) => void;
  disabled?: boolean;
  className?: string;
}

export function AsyncAutocomplete({
  label,
  helperText,
  placeholder = 'Type to search async…',
  fetcher,
  onSelect,
  disabled = false,
  className,
}: AsyncAutocompleteProps) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<AutocompleteItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    const timer = setTimeout(async () => {
      try {
        const items = await fetcher(query);
        setResults(items);
      } catch {
        setResults([]);
      } finally {
        setLoading(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [query, fetcher]);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div ref={containerRef} className={cn('relative w-full flex flex-col gap-1', className)}>
      {label && <label className="text-xs font-medium text-foreground">{label}</label>}

      <div
        className={cn(
          'relative flex h-9 w-full items-center rounded-md border border-border bg-surface text-foreground shadow-soft transition-all',
          'focus-within:outline-none focus-within:ring-2 focus-within:ring-ring focus-within:border-primary',
          disabled && 'opacity-50 cursor-not-allowed bg-muted-surface',
        )}
      >
        <Search className="ms-2.5 h-3.5 w-3.5 text-muted shrink-0" />
        <input
          type="text"
          value={query}
          disabled={disabled}
          onChange={(e) => {
            setQuery(e.target.value);
            setOpen(true);
          }}
          onFocus={() => !disabled && setOpen(true)}
          placeholder={placeholder}
          className="w-full bg-transparent px-2.5 text-xs text-foreground placeholder:text-muted focus:outline-none"
        />
        {loading && <Loader2 className="me-2.5 h-3.5 w-3.5 animate-spin text-primary shrink-0" />}
      </div>

      {open && query.trim() && !disabled && (
        <div className="absolute top-full z-50 mt-1 max-h-56 w-full overflow-y-auto rounded-md border border-border bg-surface p-1 shadow-medium ring-1 ring-border">
          {loading ? (
            <div className="p-3 text-center text-xs text-muted">Searching…</div>
          ) : results.length === 0 ? (
            <div className="p-3 text-center text-xs text-muted">No results found</div>
          ) : (
            results.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => {
                  onSelect(item);
                  setQuery(item.title);
                  setOpen(false);
                }}
                className="flex w-full flex-col rounded px-2.5 py-1.5 text-start hover:bg-muted-surface transition-colors"
              >
                <span className="text-xs font-medium text-foreground">{item.title}</span>
                {item.subtitle && <span className="text-[10px] text-muted">{item.subtitle}</span>}
              </button>
            ))
          )}
        </div>
      )}

      {helperText && <p className="text-[11px] text-muted">{helperText}</p>}
    </div>
  );
}
