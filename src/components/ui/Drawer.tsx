import { type ReactNode } from 'react';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';

export type DrawerPosition = 'left' | 'right' | 'top' | 'bottom';

export interface DrawerProps {
  open: boolean;
  onClose: () => void;
  title?: ReactNode;
  position?: DrawerPosition;
  children: ReactNode;
  className?: string;
}

const positionClasses: Record<DrawerPosition, string> = {
  right: 'inset-y-0 right-0 w-80 sm:w-96 border-s',
  left: 'inset-y-0 left-0 w-80 sm:w-96 border-e',
  top: 'inset-x-0 top-0 h-64 border-b',
  bottom: 'inset-x-0 bottom-0 h-64 border-t',
};

export function Drawer({
  open,
  onClose,
  title,
  position = 'right',
  children,
  className,
}: DrawerProps) {
  if (!open) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150"
      onClick={onClose}
    >
      <div
        className={cn(
          'fixed z-50 flex flex-col border-border bg-surface shadow-strong p-6 overflow-y-auto animate-in duration-200',
          positionClasses[position],
          className,
        )}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between pb-3 border-b border-border">
          {title && <h3 className="text-sm font-semibold text-foreground">{title}</h3>}
          <button
            type="button"
            onClick={onClose}
            className="rounded-md p-1 text-muted hover:bg-muted-surface hover:text-foreground"
            aria-label="Close drawer"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="mt-4 flex-1">{children}</div>
      </div>
    </div>
  );
}
