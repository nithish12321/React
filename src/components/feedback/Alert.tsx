import { useState, type ReactNode } from 'react';
import { Info, CheckCircle2, AlertTriangle, AlertCircle, X } from 'lucide-react';
import { cn } from '@/lib/utils';

export type AlertVariant = 'info' | 'success' | 'warning' | 'error';

export interface AlertProps {
  title?: ReactNode;
  children: ReactNode;
  variant?: AlertVariant;
  dismissible?: boolean;
  onDismiss?: () => void;
  className?: string;
}

const variantStyles: Record<AlertVariant, { box: string; icon: typeof Info; text: string }> = {
  info: {
    box: 'border-primary/20 bg-primary/5 text-foreground',
    icon: Info,
    text: 'text-primary',
  },
  success: {
    box: 'border-success/20 bg-success/5 text-foreground',
    icon: CheckCircle2,
    text: 'text-success',
  },
  warning: {
    box: 'border-warning/20 bg-warning/5 text-foreground',
    icon: AlertTriangle,
    text: 'text-warning',
  },
  error: {
    box: 'border-danger/20 bg-danger/5 text-foreground',
    icon: AlertCircle,
    text: 'text-danger',
  },
};

export function Alert({
  title,
  children,
  variant = 'info',
  dismissible = false,
  onDismiss,
  className,
}: AlertProps) {
  const [dismissed, setDismissed] = useState(false);

  if (dismissed) return null;

  const style = variantStyles[variant];
  const Icon = style.icon;

  const handleDismiss = () => {
    setDismissed(true);
    onDismiss?.();
  };

  return (
    <div
      role="alert"
      className={cn(
        'relative flex items-start gap-3 rounded-lg border p-3.5 text-xs shadow-soft transition-all',
        style.box,
        className,
      )}
    >
      <Icon className={cn('h-4 w-4 shrink-0 mt-0.5', style.text)} />
      <div className="flex-1 min-w-0">
        {title && <h4 className="font-semibold text-foreground mb-0.5">{title}</h4>}
        <div className="leading-relaxed opacity-90">{children}</div>
      </div>
      {dismissible && (
        <button
          type="button"
          onClick={handleDismiss}
          className="rounded p-0.5 text-muted hover:text-foreground hover:bg-muted-surface transition-colors"
          aria-label="Dismiss alert"
        >
          <X className="h-3.5 w-3.5" />
        </button>
      )}
    </div>
  );
}
