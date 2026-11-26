import { useState, useRef, useEffect, type ReactNode, type MouseEvent } from 'react';
import { cn } from '@/lib/utils';
import type { DropdownMenuItem } from './DropdownMenu';

export interface ContextMenuProps {
  children: ReactNode;
  items: DropdownMenuItem[];
  className?: string;
}

export function ContextMenu({ children, items, className }: ContextMenuProps) {
  const [open, setOpen] = useState(false);
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const menuRef = useRef<HTMLDivElement>(null);

  const handleContextMenu = (e: MouseEvent) => {
    e.preventDefault();
    setPos({ x: e.clientX, y: e.clientY });
    setOpen(true);
  };

  useEffect(() => {
    const handleClose = () => setOpen(false);
    window.addEventListener('click', handleClose);
    window.addEventListener('scroll', handleClose);
    return () => {
      window.removeEventListener('click', handleClose);
      window.removeEventListener('scroll', handleClose);
    };
  }, []);

  return (
    <>
      <div onContextMenu={handleContextMenu} className={cn('cursor-context-menu', className)}>
        {children}
      </div>

      {open && (
        <div
          ref={menuRef}
          style={{ top: pos.y, left: pos.x }}
          className="fixed z-50 min-w-[180px] rounded-lg border border-border bg-surface p-1 shadow-strong ring-1 ring-border animate-in fade-in zoom-in-95 duration-100"
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
    </>
  );
}
