import { useState, type ReactNode } from 'react';
import { ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface AccordionItemData {
  id: string;
  title: ReactNode;
  content: ReactNode;
  disabled?: boolean;
}

export interface AccordionProps {
  items: AccordionItemData[];
  type?: 'single' | 'multiple';
  defaultOpen?: string[];
  className?: string;
}

export function Accordion({ items, type = 'single', defaultOpen = [], className }: AccordionProps) {
  const [openIds, setOpenIds] = useState<string[]>(defaultOpen);

  const toggle = (id: string) => {
    if (type === 'single') {
      setOpenIds(openIds.includes(id) ? [] : [id]);
    } else {
      setOpenIds(openIds.includes(id) ? openIds.filter((item) => item !== id) : [...openIds, id]);
    }
  };

  return (
    <div
      className={cn(
        'divide-y divide-border rounded-xl border border-border bg-surface shadow-soft overflow-hidden',
        className,
      )}
    >
      {items.map((item) => {
        const isOpen = openIds.includes(item.id);
        return (
          <div key={item.id} className="transition-colors">
            <button
              type="button"
              disabled={item.disabled}
              onClick={() => toggle(item.id)}
              className={cn(
                'flex w-full items-center justify-between p-4 text-start text-xs font-semibold text-foreground transition-colors hover:bg-muted-surface/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
                item.disabled && 'opacity-50 cursor-not-allowed',
              )}
            >
              <span>{item.title}</span>
              <ChevronDown
                className={cn(
                  'h-4 w-4 shrink-0 text-muted transition-transform duration-200',
                  isOpen && 'rotate-180',
                )}
              />
            </button>

            {isOpen && (
              <div className="px-4 pb-4 pt-1 text-xs text-muted leading-relaxed animate-in fade-in duration-150">
                {item.content}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
