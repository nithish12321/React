import { useState } from 'react';
import { WifiOff, RefreshCw } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface OfflineBannerProps {
  className?: string;
}

export function OfflineBanner({ className }: OfflineBannerProps) {
  const [simulatedOffline, setSimulatedOffline] = useState(false);

  return (
    <div className={cn('w-full flex flex-col gap-2', className)}>
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium text-foreground">Offline Status Simulator</span>
        <button
          type="button"
          onClick={() => setSimulatedOffline((prev) => !prev)}
          className="text-[11px] text-primary hover:underline font-semibold"
        >
          {simulatedOffline ? 'Simulate Reconnect' : 'Simulate Offline Mode'}
        </button>
      </div>

      {simulatedOffline ? (
        <div className="flex items-center justify-between rounded-lg border border-danger/30 bg-danger/10 px-3.5 py-2 text-xs text-danger shadow-soft">
          <div className="flex items-center gap-2">
            <WifiOff className="h-4 w-4 shrink-0" />
            <span className="font-semibold">
              You are currently offline. Changes are saved locally.
            </span>
          </div>
          <button
            type="button"
            onClick={() => setSimulatedOffline(false)}
            className="flex items-center gap-1 rounded bg-danger px-2 py-0.5 text-[11px] font-bold text-white hover:opacity-90"
          >
            <RefreshCw className="h-3 w-3" />
            Retry
          </button>
        </div>
      ) : (
        <div className="rounded-lg border border-border bg-muted-surface/40 px-3.5 py-2 text-xs text-muted flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-success" />
          <span>Connected to mock backend network.</span>
        </div>
      )}
    </div>
  );
}
