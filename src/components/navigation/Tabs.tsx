import { type ReactNode } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

export type TabsVariant = 'horizontal' | 'vertical' | 'pill';

export interface TabItem {
  id: string;
  label: string;
  icon?: ReactNode;
  badge?: number | string;
  disabled?: boolean;
}

export interface TabsProps {
  tabs: TabItem[];
  activeId: string;
  onChange: (id: string) => void;
  variant?: TabsVariant;
  className?: string;
}

export function Tabs({ tabs, activeId, onChange, variant = 'horizontal', className }: TabsProps) {
  const isPill = variant === 'pill';
  const isVertical = variant === 'vertical';

  return (
    <div
      role="tablist"
      aria-orientation={isVertical ? 'vertical' : 'horizontal'}
      className={cn(
        'relative flex gap-1',
        isVertical ? 'flex-col border-e border-border pe-2' : 'border-b border-border pb-px',
        isPill && 'rounded-lg border border-border bg-muted-surface p-1 shadow-soft',
        className,
      )}
    >
      {tabs.map((tab) => {
        const isActive = activeId === tab.id;
        return (
          <button
            key={tab.id}
            type="button"
            role="tab"
            aria-selected={isActive}
            disabled={tab.disabled}
            onClick={() => onChange(tab.id)}
            className={cn(
              'relative flex items-center gap-2 px-3 py-2 text-xs font-medium transition-colors cursor-pointer select-none',
              isPill ? 'rounded-md' : 'rounded-t-md',
              isActive
                ? isPill
                  ? 'text-foreground font-semibold'
                  : 'text-primary font-bold'
                : 'text-muted hover:text-foreground',
              tab.disabled && 'opacity-50 cursor-not-allowed',
            )}
          >
            {tab.icon && <span className="shrink-0">{tab.icon}</span>}
            <span>{tab.label}</span>
            {tab.badge !== undefined && (
              <span
                className={cn(
                  'rounded-full px-1.5 py-0.2 text-[10px] font-bold',
                  isActive ? 'bg-primary/20 text-primary' : 'bg-muted-surface text-muted',
                )}
              >
                {tab.badge}
              </span>
            )}

            {/* Pill Active Highlight */}
            {isPill && isActive && (
              <motion.div
                layoutId="pill-active"
                className="absolute inset-0 -z-10 rounded-md bg-surface shadow-xs"
                transition={{ type: 'spring', stiffness: 500, damping: 35 }}
              />
            )}

            {/* Line Active Indicator */}
            {!isPill && isActive && (
              <motion.div
                layoutId="tab-line-active"
                className={cn(
                  'absolute bg-primary',
                  isVertical ? 'inset-y-0 end-0 w-0.5' : 'inset-x-0 bottom-0 h-0.5',
                )}
                transition={{ type: 'spring', stiffness: 500, damping: 35 }}
              />
            )}
          </button>
        );
      })}
    </div>
  );
}
