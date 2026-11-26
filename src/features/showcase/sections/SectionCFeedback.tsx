import { useState } from 'react';
import { useAppDispatch } from '@/app/hooks';
import { pushToast } from '@/features/ui/uiSlice';
import { Alert } from '@/components/feedback/Alert';
import { ProgressBar, CircularProgress } from '@/components/feedback/ProgressBar';
import { Skeleton } from '@/components/feedback/Skeleton';
import { Spinner } from '@/components/feedback/Spinner';
import { EmptyState } from '@/components/feedback/EmptyState';
import { ResultPage } from '@/components/feedback/ResultPage';
import { Badge } from '@/components/ui/Badge';
import { OfflineBanner } from '@/components/feedback/OfflineBanner';
import { Button } from '@/components/ui/Button';

export function SectionCFeedback() {
  const dispatch = useAppDispatch();
  const [progressVal, setProgressVal] = useState(65);

  const triggerToast = (variant: 'default' | 'success' | 'warning' | 'error') => {
    dispatch(
      pushToast({
        title: `${variant.toUpperCase()} Notification`,
        description: `This toast was triggered with variant="${variant}".`,
        variant,
      }),
    );
  };

  return (
    <div className="space-y-6">
      {/* Toasts Trigger Panel */}
      <div className="rounded-xl border border-border bg-surface p-4 shadow-soft space-y-3">
        <h3 className="text-xs font-semibold text-foreground">
          Stacked Toasts (Notification Center)
        </h3>
        <p className="text-xs text-muted">
          Dispatches auto-dismissing toast notifications rendered in the bottom right corner.
        </p>
        <div className="flex flex-wrap items-center gap-2 pt-1">
          <Button size="sm" variant="outline" onClick={() => triggerToast('default')}>
            Default Toast
          </Button>
          <Button size="sm" variant="default" onClick={() => triggerToast('success')}>
            Success Toast
          </Button>
          <Button size="sm" variant="outline" onClick={() => triggerToast('warning')}>
            Warning Toast
          </Button>
          <Button size="sm" variant="danger" onClick={() => triggerToast('error')}>
            Error Toast
          </Button>
        </div>
      </div>

      {/* Alerts (4 Variants) */}
      <div className="rounded-xl border border-border bg-surface p-4 shadow-soft space-y-3">
        <h3 className="text-xs font-semibold text-foreground">
          Alerts (Info, Success, Warning, Error)
        </h3>
        <div className="space-y-2.5">
          <Alert variant="info" title="System Maintenance" dismissible>
            Scheduled database backup will take place at midnight UTC.
          </Alert>
          <Alert variant="success" title="Payment Succeeded" dismissible>
            Your monthly subscription was renewed successfully.
          </Alert>
          <Alert variant="warning" title="Disk Space Warning" dismissible>
            Storage capacity reached 85%. Consider archiving older logs.
          </Alert>
          <Alert variant="error" title="Connection Timeout" dismissible>
            Could not reach remote gateway. Please verify network credentials.
          </Alert>
        </div>
      </div>

      {/* Progress Bars & Circular Spinners */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="rounded-xl border border-border bg-surface p-4 shadow-soft space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-semibold text-foreground">Linear Progress Bars</h3>
            <button
              type="button"
              onClick={() => setProgressVal((v) => (v >= 100 ? 15 : v + 20))}
              className="text-[11px] text-primary hover:underline"
            >
              Update Value
            </button>
          </div>
          <ProgressBar value={progressVal} size="sm" variant="primary" showValue />
          <ProgressBar value={85} size="md" variant="success" showValue />
          <ProgressBar value={40} size="lg" variant="warning" showValue />
          <ProgressBar indeterminate size="md" variant="primary" />
        </div>

        <div className="rounded-xl border border-border bg-surface p-4 shadow-soft space-y-3">
          <h3 className="text-xs font-semibold text-foreground">Circular Progress & Spinners</h3>
          <div className="flex items-center gap-6 pt-2">
            <CircularProgress value={progressVal} variant="primary" />
            <CircularProgress value={92} variant="success" />
            <CircularProgress value={35} variant="danger" />
            <div className="flex items-center gap-2 ps-4 border-s border-border">
              <Spinner size="sm" />
              <Spinner size="md" />
              <Spinner size="lg" />
            </div>
          </div>
        </div>
      </div>

      {/* Skeleton Loaders & Badges */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="rounded-xl border border-border bg-surface p-4 shadow-soft space-y-3">
          <h3 className="text-xs font-semibold text-foreground">Skeleton Shimmer Loaders</h3>
          <div className="flex items-center gap-3">
            <Skeleton circle className="h-10 w-10" />
            <div className="space-y-1.5 flex-1">
              <Skeleton className="h-3.5 w-3/4" />
              <Skeleton className="h-3 w-1/2" />
            </div>
          </div>
          <Skeleton className="h-16 w-full mt-2" />
        </div>

        <div className="rounded-xl border border-border bg-surface p-4 shadow-soft space-y-3">
          <h3 className="text-xs font-semibold text-foreground">Badges & Status Chips</h3>
          <div className="flex flex-wrap items-center gap-2 pt-1">
            <Badge variant="default" dot>
              In Progress
            </Badge>
            <Badge variant="success" dot count={12}>
              Active
            </Badge>
            <Badge variant="warning" dot>
              Pending
            </Badge>
            <Badge variant="danger" dot>
              Blocked
            </Badge>
            <Badge variant="outline" removable onRemove={() => void 0}>
              Filter Chip
            </Badge>
          </div>
        </div>
      </div>

      {/* Result Pages & Empty State */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <EmptyState
          title="No Invoices Found"
          description="You haven't generated any billing invoices for this cycle yet."
          action={<Button size="sm">Create Invoice</Button>}
          secondaryAction={
            <Button size="sm" variant="outline">
              Learn More
            </Button>
          }
        />

        <ResultPage
          type="success"
          title="Operation Verified"
          description="All feedback components are active and responsive."
          onPrimaryClick={() => void 0}
        />
      </div>

      {/* Offline Banner */}
      <div className="rounded-xl border border-border bg-surface p-4 shadow-soft">
        <OfflineBanner />
      </div>
    </div>
  );
}
