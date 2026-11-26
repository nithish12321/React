import { useState } from 'react';
import { FileText, Code2, Sliders } from 'lucide-react';
import { SectionABasic } from './SectionABasic';
import { SectionAIntermediate } from './SectionAIntermediate';
import { SectionAAdvanced } from './SectionAAdvanced';
import type { InputDisplayState, InputSize } from '@/components/ui/Input';
import { cn } from '@/lib/utils';

export function SectionA() {
  const [state, setState] = useState<InputDisplayState>('default');
  const [size, setSize] = useState<InputSize>('md');
  const [showCode, setShowCode] = useState(false);
  const [subTab, setSubTab] = useState<'basic' | 'intermediate' | 'advanced'>('basic');

  return (
    <section
      id="section-a"
      className="scroll-mt-20 rounded-xl border border-border bg-surface p-6 shadow-soft transition-all"
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-5 border-b border-border">
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary text-primary-fg font-bold text-sm shadow-soft">
            A
          </div>
          <div>
            <div className="flex items-center gap-2">
              <FileText className="h-4 w-4 text-primary" aria-hidden />
              <h2 className="text-lg font-bold text-foreground">A · Form Elements</h2>
            </div>
            <p className="mt-1 text-xs text-muted max-w-2xl">
              Basic, intermediate, and advanced form controls rendered in all states and sizes.
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
          <div className="text-muted mb-1 font-sans font-semibold">// Form Controls Usage:</div>
          <pre>{`<Input label="Email" size="${size}" state="${state}" prefixIcon={<Mail />} />
<MultiSelect options={options} value={selected} onChange={setSelected} />
<RichTextEditor value={html} onChange={setHtml} />`}</pre>
        </div>
      )}

      {/* State & Size Global Control Bar */}
      <div className="mt-5 rounded-lg border border-border bg-muted-surface/40 p-3 flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2">
          <span className="flex items-center gap-1 text-xs font-semibold text-foreground">
            <Sliders className="h-3.5 w-3.5 text-primary" />
            <span>Simulate State:</span>
          </span>
          {(
            [
              'default',
              'hover',
              'focus',
              'filled',
              'error',
              'success',
              'disabled',
              'read-only',
              'loading',
            ] as InputDisplayState[]
          ).map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => setState(s)}
              className={cn(
                'rounded-md px-2 py-1 text-[11px] font-medium capitalize transition-colors',
                state === s
                  ? 'bg-primary text-primary-fg font-bold shadow-xs'
                  : 'bg-surface border border-border text-foreground hover:bg-muted-surface',
              )}
            >
              {s}
            </button>
          ))}
        </div>

        {/* Size Selector */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-foreground">Size:</span>
          {(['sm', 'md', 'lg'] as InputSize[]).map((sz) => (
            <button
              key={sz}
              type="button"
              onClick={() => setSize(sz)}
              className={cn(
                'rounded-md px-2.5 py-1 text-[11px] font-bold uppercase transition-colors',
                size === sz
                  ? 'bg-primary text-primary-fg shadow-xs'
                  : 'bg-surface border border-border text-foreground hover:bg-muted-surface',
              )}
            >
              {sz}
            </button>
          ))}
        </div>
      </div>

      {/* Category Tabs: Basic, Intermediate, Advanced */}
      <div className="mt-5 border-b border-border flex items-center gap-2">
        {(['basic', 'intermediate', 'advanced'] as const).map((tab) => (
          <button
            key={tab}
            type="button"
            onClick={() => setSubTab(tab)}
            className={cn(
              'px-3 py-2 text-xs font-bold capitalize transition-colors border-b-2 -mb-px',
              subTab === tab
                ? 'border-primary text-primary'
                : 'border-transparent text-muted hover:text-foreground',
            )}
          >
            {tab === 'basic'
              ? 'Basic Elements'
              : tab === 'intermediate'
                ? 'Intermediate Elements'
                : 'Advanced Patterns'}
          </button>
        ))}
      </div>

      {/* Render selected group */}
      <div className="mt-5">
        {subTab === 'basic' && <SectionABasic state={state} size={size} />}
        {subTab === 'intermediate' && <SectionAIntermediate state={state} size={size} />}
        {subTab === 'advanced' && <SectionAAdvanced state={state} size={size} />}
      </div>
    </section>
  );
}
