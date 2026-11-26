import { AlertCircle, Inbox } from 'lucide-react';
import { EmptyState } from '@/components/feedback/EmptyState';
import { Skeleton } from '@/components/feedback/Skeleton';
import { Button } from '@/components/ui/Button';

export function TableSkeleton({ rows = 8, cols = 6 }: { rows?: number; cols?: number }) {
  return (
    <div className="p-3 space-y-2" role="status" aria-label="Loading table">
      {Array.from({ length: rows }).map((_, r) => (
        <div key={r} className="flex gap-2">
          {Array.from({ length: cols }).map((__, c) => (
            <Skeleton key={c} className="h-8 flex-1" />
          ))}
        </div>
      ))}
    </div>
  );
}

export function TableEmpty({ onClear }: { onClear?: () => void }) {
  return (
    <EmptyState
      icon={<Inbox className="h-6 w-6" />}
      title="No matching rows"
      description="Try a different search or remove some filters."
      action={
        onClear ? (
          <Button size="sm" variant="outline" onClick={onClear}>
            Clear filters
          </Button>
        ) : undefined
      }
    />
  );
}

export function TableError({ message, onRetry }: { message: string; onRetry: () => void }) {
  return (
    <EmptyState
      icon={<AlertCircle className="h-6 w-6 text-danger" />}
      title="Could not load rows"
      description={message}
      action={
        <Button size="sm" onClick={onRetry}>
          Retry
        </Button>
      }
    />
  );
}
