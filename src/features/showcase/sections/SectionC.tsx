import { useState } from 'react';
import { Layers, Code2 } from 'lucide-react';
import { SectionCOverlays } from './SectionCOverlays';
import { SectionCFeedback } from './SectionCFeedback';
import { cn } from '@/lib/utils';

export function SectionC() {
  const [tab, setTab] = useState<'overlays' | 'feedback'>('overlays');
  const [showCode, setShowCode] = useState(false);

  return (
    <section
      id="section-c"
      className="scroll-mt-20 rounded-xl border border-border bg-surface p-6 shadow-soft transition-all"
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-5 border-b border-border">
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary text-primary-fg font-bold text-sm shadow-soft">
            C
          </div>
          <div>
            <div className="flex items-center gap-2">
              <Layers className="h-4 w-4 text-primary" aria-hidden />
              <h2 className="text-lg font-bold text-foreground">C · Overlays & Feedback</h2>
            </div>
            <p className="mt-1 text-xs text-muted max-w-2xl">
              Modals, drawers, confirm dialogs, popovers, tooltips, stacked toasts, alerts, and
              progress indicators.
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setShowCode((v) => !v)}
          className="flex items-center gap-1.5 self-start sm:self-center rounded-md border border-border bg-muted-surface px-2.5 py-1 text-xs font-medium text-foreground hover:bg-surface transition-colors"
        >
          <Code2 className="h-3.5 w-3.5 text-muted" />
          <span>{showCode ? 'Hide code' : 'View code'}</span>
        </button>
      </div>

      {/* Code Toggle Drawer */}
      {showCode && (
        <div className="mt-4 rounded-lg border border-border bg-muted-surface/70 p-3 font-mono text-[11px] text-foreground overflow-x-auto">
          <div className="text-muted mb-1 font-sans font-semibold">
            // Overlays & Feedback Usage:
          </div>
          <pre>{`<Modal open={open} onClose={() => setOpen(false)} size="lg" title="Modal Title">
  Modal content...
</Modal>
<Alert variant="success" title="Success">Operation completed!</Alert>
<ProgressBar value={75} variant="primary" showValue />`}</pre>
        </div>
      )}

      {/* Navigation Subtabs */}
      <div className="mt-5 border-b border-border flex items-center gap-2">
        <button
          type="button"
          onClick={() => setTab('overlays')}
          className={cn(
            'px-3 py-2 text-xs font-bold capitalize transition-colors border-b-2 -mb-px',
            tab === 'overlays'
              ? 'border-primary text-primary'
              : 'border-transparent text-muted hover:text-foreground',
          )}
        >
          Overlays (Modals, Drawers, Popovers)
        </button>
        <button
          type="button"
          onClick={() => setTab('feedback')}
          className={cn(
            'px-3 py-2 text-xs font-bold capitalize transition-colors border-b-2 -mb-px',
            tab === 'feedback'
              ? 'border-primary text-primary'
              : 'border-transparent text-muted hover:text-foreground',
          )}
        >
          Feedback (Toasts, Alerts, Progress, Skeletons)
        </button>
      </div>

      {/* Content */}
      <div className="mt-5">
        {tab === 'overlays' && <SectionCOverlays />}
        {tab === 'feedback' && <SectionCFeedback />}
      </div>
    </section>
  );
}
