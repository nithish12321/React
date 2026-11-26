import { useAppDispatch, useAppSelector } from '@/app/hooks';
import { dismissToast } from '@/features/ui/uiSlice';
import { useEffect } from 'react';
import { X, CheckCircle2, AlertTriangle, AlertCircle, Info } from 'lucide-react';
import { cn } from '@/lib/utils';

const ICONS = {
  success: CheckCircle2,
  error: AlertCircle,
  warning: AlertTriangle,
  default: Info,
} as const;

const ICON_COLORS = {
  success: 'text-success',
  error: 'text-danger',
  warning: 'text-warning',
  default: 'text-primary',
} as const;

function ToastItem({
  id,
  title,
  description,
  variant,
}: {
  id: string;
  title: string;
  description?: string;
  variant: keyof typeof ICONS;
}) {
  const dispatch = useAppDispatch();
  useEffect(() => {
    const t = setTimeout(() => dispatch(dismissToast(id)), 5000);
    return () => clearTimeout(t);
  }, [id, dispatch]);
  const Icon = ICONS[variant];
  return (
    <div
      role="status"
      className="pointer-events-auto flex w-80 items-start gap-3 rounded-lg bg-surface p-4 shadow-medium ring-1 ring-border"
    >
      <Icon className={cn('mt-0.5 h-5 w-5 shrink-0', ICON_COLORS[variant])} aria-hidden />
      <div className="min-w-0 flex-1">
        <p className="text-sm font-semibold">{title}</p>
        {description && <p className="mt-0.5 text-sm text-muted">{description}</p>}
      </div>
      <button
        type="button"
        aria-label="Dismiss notification"
        onClick={() => dispatch(dismissToast(id))}
        className="rounded-md p-1 text-muted hover:bg-muted-surface"
      >
        <X className="h-4 w-4" aria-hidden />
      </button>
    </div>
  );
}

export function Toaster() {
  const toasts = useAppSelector((s) => s.ui.toasts);
  return (
    <div
      aria-live="polite"
      className="pointer-events-none fixed bottom-4 right-4 z-50 flex flex-col gap-2"
    >
      {toasts.map((t) => (
        <ToastItem
          key={t.id}
          id={t.id}
          title={t.title}
          description={t.description}
          variant={t.variant}
        />
      ))}
    </div>
  );
}
