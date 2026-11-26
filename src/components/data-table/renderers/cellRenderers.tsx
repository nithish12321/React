import { type ReactNode } from 'react';
import { ExternalLink, CheckCircle2, XCircle } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import type { ColumnConfig } from '../types';
import { InlineEditCell } from './InlineEditCell';

export function BadgeCell({ value }: { value: unknown }) {
  const str = String(value ?? '').toLowerCase();
  let color = 'bg-surface text-foreground border-border';

  if (['active', 'completed', 'success', 'paid', 'verified'].includes(str)) {
    color = 'bg-success/15 text-success border-success/30';
  } else if (['pending', 'in_progress', 'draft', 'processing'].includes(str)) {
    color = 'bg-warning/15 text-warning border-warning/30';
  } else if (['inactive', 'suspended', 'failed', 'cancelled', 'banned'].includes(str)) {
    color = 'bg-danger/15 text-danger border-danger/30';
  } else if (['admin', 'manager', 'lead', 'pro'].includes(str)) {
    color = 'bg-primary/15 text-primary border-primary/30';
  }

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-xs font-semibold uppercase tracking-wider',
        color,
      )}
    >
      <span className="h-1.5 w-1.5 rounded-full bg-current opacity-80" />
      {String(value ?? '')}
    </span>
  );
}

export function AvatarCell({
  value,
  subtitle,
  avatarUrl,
}: {
  value: unknown;
  subtitle?: unknown;
  avatarUrl?: string;
}) {
  const name = String(value ?? 'User');
  const sub = subtitle ? String(subtitle) : null;
  const initials = name
    .split(' ')
    .map((n) => n[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();

  return (
    <div className="flex items-center gap-3">
      {avatarUrl ? (
        <img
          src={avatarUrl}
          alt={name}
          className="h-9 w-9 rounded-full object-cover border border-border"
        />
      ) : (
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary border border-primary/20 text-xs font-bold">
          {initials}
        </div>
      )}
      <div className="flex flex-col min-w-0">
        <span className="font-semibold text-foreground text-sm truncate">{name}</span>
        {sub && <span className="text-xs text-muted truncate">{sub}</span>}
      </div>
    </div>
  );
}

export function ProgressCell({ value }: { value: unknown }) {
  const num = Math.min(100, Math.max(0, Number(value) || 0));
  let barColor = 'bg-primary';
  if (num >= 80) barColor = 'bg-success';
  else if (num < 40) barColor = 'bg-warning';

  return (
    <div className="flex items-center gap-3 min-w-[120px]">
      <div className="h-2 w-full rounded-full bg-surface-hover overflow-hidden border border-border">
        <div
          className={cn('h-full transition-all duration-300 rounded-full', barColor)}
          style={{ width: `${num}%` }}
        />
      </div>
      <span className="text-xs font-medium text-muted w-9 text-right">{num}%</span>
    </div>
  );
}

export function LinkCell({
  value,
  href,
  isExternal,
}: {
  value: unknown;
  href?: string;
  isExternal?: boolean;
}) {
  const text = String(value ?? '');
  const url = href || (text.includes('@') ? `mailto:${text}` : text);

  return (
    <a
      href={url}
      target={isExternal ? '_blank' : undefined}
      rel={isExternal ? 'noopener noreferrer' : undefined}
      className="inline-flex items-center gap-1 text-primary hover:underline font-medium text-sm"
      onClick={(e) => e.stopPropagation()}
    >
      <span>{text}</span>
      {isExternal && <ExternalLink className="h-3 w-3 opacity-70" />}
    </a>
  );
}

export function CurrencyCell({ value, currency = '$' }: { value: unknown; currency?: string }) {
  const num = Number(value);
  if (isNaN(num)) return <span className="text-muted text-sm">-</span>;
  const formatted = num.toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

  return (
    <span className="font-mono text-sm font-semibold text-foreground">
      {currency}
      {formatted}
    </span>
  );
}

export function DateCell({
  value,
  dateFormat = 'MMM dd, yyyy',
}: {
  value: unknown;
  dateFormat?: string;
}) {
  if (!value) return <span className="text-muted text-sm">-</span>;
  try {
    const d = value instanceof Date ? value : new Date(String(value));
    if (isNaN(d.getTime())) return <span className="text-muted text-sm">-</span>;
    return <span className="text-sm text-foreground">{format(d, dateFormat)}</span>;
  } catch {
    return <span className="text-sm text-foreground">{String(value)}</span>;
  }
}

export function BooleanCell({ value }: { value: unknown }) {
  const isTrue = Boolean(value);
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-xs font-semibold',
        isTrue ? 'bg-success/15 text-success' : 'bg-muted-surface text-muted',
      )}
    >
      {isTrue ? (
        <CheckCircle2 className="h-3.5 w-3.5 text-success" />
      ) : (
        <XCircle className="h-3.5 w-3.5 text-muted" />
      )}
      {isTrue ? 'Yes' : 'No'}
    </span>
  );
}

export function renderCell<T>(row: T, column: ColumnConfig<T>, value: unknown): ReactNode {
  if (column.cell) {
    return column.cell({ row, value, getValue: () => value });
  }

  if (column.editable) {
    return <InlineEditCell row={row} column={column} value={value} />;
  }

  switch (column.cellRenderer) {
    case 'badge':
      return <BadgeCell value={value} />;
    case 'avatar': {
      const avatarUrl = column.cellRendererProps?.avatarKey
        ? (row as Record<string, unknown>)[column.cellRendererProps.avatarKey as string]
        : undefined;
      const subtitle = column.cellRendererProps?.subtitleKey
        ? (row as Record<string, unknown>)[column.cellRendererProps.subtitleKey as string]
        : undefined;
      return (
        <AvatarCell
          value={value}
          subtitle={subtitle}
          avatarUrl={typeof avatarUrl === 'string' ? avatarUrl : undefined}
        />
      );
    }
    case 'progress':
      return <ProgressCell value={value} />;
    case 'link':
      return <LinkCell value={value} isExternal={Boolean(column.cellRendererProps?.isExternal)} />;
    case 'currency':
      return (
        <CurrencyCell value={value} currency={String(column.cellRendererProps?.currency || '$')} />
      );
    case 'date':
      return (
        <DateCell
          value={value}
          dateFormat={String(column.cellRendererProps?.dateFormat || 'MMM dd, yyyy')}
        />
      );
    case 'boolean':
      return <BooleanCell value={value} />;
    default:
      return <span className="text-sm text-foreground">{String(value ?? '')}</span>;
  }
}
