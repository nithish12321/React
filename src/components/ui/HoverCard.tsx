import { useState, type ReactNode } from 'react';
import { cn } from '@/lib/utils';

export interface HoverCardProps {
  trigger: ReactNode;
  children: ReactNode;
  className?: string;
}

export function HoverCard({ trigger, children, className }: HoverCardProps) {
  const [open, setOpen] = useState(false);

  return (
    <div
      className="relative inline-block"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      <div className="inline-block cursor-pointer">{trigger}</div>

      {open && (
        <div
          className={cn(
            'absolute z-50 mt-1 w-64 rounded-xl border border-border bg-surface p-4 shadow-strong animate-in fade-in zoom-in-95 duration-150',
            className,
          )}
        >
          {children}
        </div>
      )}
    </div>
  );
}
