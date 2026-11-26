import { useState, useRef, useEffect, type ReactNode } from 'react';
import { cn } from '@/lib/utils';

export interface DropdownMenuItem {
  id: string;
  label: string;
  icon?: ReactNode;
  shortcut?: string;
  destructive?: boolean;
  disabled?: boolean;
  onClick?: () => void;
  separator?: boolean;
}

export interface DropdownMenuProps {
  trigger: ReactNode;
  items: DropdownMenuItem[];
  align?: 'start' | 'end';
  className?: string;
}

export function DropdownMenu({ trigger, items, align = 'start', className }: DropdownMenuProps) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

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
    <div ref={containerRef} className="relative inline-block">
      <div onClick={() => setOpen((prev) => !prev)} className="inline-block cursor-pointer">
        {trigger}
      </div>

      {open && (
        <div
          className={cn(
            'absolute z-50 mt-1.5 min-w-[180px] rounded-lg border border-border bg-surface p-1 shadow-medium ring-1 ring-border animate-in fade-in zoom-in-95 duration-100',
            align === 'end' ? 'end-0' : 'start-0',
            className,
          )}
        >
          {items.map((item) => {
            if (item.separator) {
              return <div key={item.id} className="my-1 border-t border-border" />;
            }

            return (
              <button
                key={item.id}
                type="button"
                disabled={item.disabled}
                onClick={() => {
                  item.onClick?.();
                  setOpen(false);
                }}
                className={cn(
                  'flex w-full items-center justify-between rounded-md px-2.5 py-1.5 text-xs font-medium transition-colors text-start',
                  item.destructive
                    ? 'text-danger hover:bg-danger/10'
                    : 'text-foreground hover:bg-muted-surface',
                  item.disabled && 'opacity-50 cursor-not-allowed',
                )}
              >
                <div className="flex items-center gap-2">
                  {item.icon && <span className="shrink-0 text-muted">{item.icon}</span>}
                  <span>{item.label}</span>
                </div>
                {item.shortcut && (
                  <kbd className="ms-3 font-mono text-[10px] text-muted">{item.shortcut}</kbd>
                )}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
