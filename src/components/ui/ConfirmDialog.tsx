import { AlertTriangle, Info, AlertCircle } from 'lucide-react';
import { Modal } from './Modal';
import { Button } from './Button';

export interface ConfirmDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: 'danger' | 'warning' | 'info';
  loading?: boolean;
}

export function ConfirmDialog({
  open,
  onClose,
  onConfirm,
  title,
  message,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  variant = 'danger',
  loading = false,
}: ConfirmDialogProps) {
  const Icon = variant === 'danger' ? AlertCircle : variant === 'warning' ? AlertTriangle : Info;

  const iconColor =
    variant === 'danger'
      ? 'text-danger bg-danger/10'
      : variant === 'warning'
        ? 'text-warning bg-warning/10'
        : 'text-primary bg-primary/10';

  return (
    <Modal open={open} onClose={onClose} size="sm">
      <div className="flex flex-col items-center text-center p-2">
        <div
          className={`flex h-12 w-12 items-center justify-center rounded-full mb-3 ${iconColor}`}
        >
          <Icon className="h-6 w-6" />
        </div>
        <h3 className="text-base font-bold text-foreground">{title}</h3>
        <p className="mt-2 text-xs text-muted leading-relaxed">{message}</p>

        <div className="mt-6 flex items-center justify-center gap-2 w-full">
          <Button
            variant="outline"
            size="sm"
            onClick={onClose}
            disabled={loading}
            className="w-full"
          >
            {cancelLabel}
          </Button>
          <Button
            variant={variant === 'danger' ? 'danger' : 'default'}
            size="sm"
            onClick={onConfirm}
            loading={loading}
            className="w-full"
          >
            {confirmLabel}
          </Button>
        </div>
      </div>
    </Modal>
  );
}
