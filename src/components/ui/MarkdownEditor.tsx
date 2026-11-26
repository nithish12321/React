import { useState } from 'react';
import { Eye, Edit3 } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface MarkdownEditorProps {
  label?: string;
  helperText?: string;
  value: string;
  onChange: (val: string) => void;
  disabled?: boolean;
  className?: string;
}

export function MarkdownEditor({
  label,
  helperText,
  value,
  onChange,
  disabled = false,
  className,
}: MarkdownEditorProps) {
  const [tab, setTab] = useState<'write' | 'preview'>('write');

  // Simple clean markdown parser for preview
  const renderMarkdown = (src: string) => {
    const lines = src.split('\n');
    return lines.map((line, i) => {
      if (line.startsWith('### ')) {
        return (
          <h4 key={i} className="text-sm font-bold mt-2 mb-1">
            {line.replace('### ', '')}
          </h4>
        );
      }
      if (line.startsWith('## ')) {
        return (
          <h3 key={i} className="text-base font-bold mt-3 mb-1">
            {line.replace('## ', '')}
          </h3>
        );
      }
      if (line.startsWith('# ')) {
        return (
          <h2 key={i} className="text-lg font-bold mt-4 mb-2">
            {line.replace('# ', '')}
          </h2>
        );
      }
      if (line.startsWith('- ')) {
        return (
          <li key={i} className="list-disc ms-4 text-xs">
            {line.replace('- ', '')}
          </li>
        );
      }
      if (line.startsWith('> ')) {
        return (
          <blockquote
            key={i}
            className="border-s-2 border-primary ps-2.5 py-1 my-1.5 text-xs italic bg-muted-surface/40 rounded-e"
          >
            {line.replace('> ', '')}
          </blockquote>
        );
      }
      if (!line.trim()) {
        return <div key={i} className="h-2" />;
      }
      return (
        <p key={i} className="text-xs my-0.5 leading-relaxed">
          {line}
        </p>
      );
    });
  };

  return (
    <div className={cn('w-full flex flex-col gap-1', className)}>
      <div className="flex items-center justify-between">
        {label && <label className="text-xs font-medium text-foreground">{label}</label>}

        {/* Tab switcher */}
        <div className="inline-flex rounded-md border border-border bg-muted-surface p-0.5">
          <button
            type="button"
            onClick={() => setTab('write')}
            className={cn(
              'flex items-center gap-1 rounded px-2 py-0.5 text-[11px] font-medium transition-colors',
              tab === 'write'
                ? 'bg-surface text-foreground shadow-xs font-bold'
                : 'text-muted hover:text-foreground',
            )}
          >
            <Edit3 className="h-3 w-3" />
            <span>Write</span>
          </button>
          <button
            type="button"
            onClick={() => setTab('preview')}
            className={cn(
              'flex items-center gap-1 rounded px-2 py-0.5 text-[11px] font-medium transition-colors',
              tab === 'preview'
                ? 'bg-surface text-foreground shadow-xs font-bold'
                : 'text-muted hover:text-foreground',
            )}
          >
            <Eye className="h-3 w-3" />
            <span>Preview</span>
          </button>
        </div>
      </div>

      <div
        className={cn(
          'rounded-md border border-border bg-surface text-foreground shadow-soft transition-all min-h-[120px] overflow-hidden',
          'focus-within:ring-2 focus-within:ring-ring focus-within:border-primary',
          disabled && 'opacity-50 cursor-not-allowed bg-muted-surface',
        )}
      >
        {tab === 'write' ? (
          <textarea
            value={value}
            disabled={disabled}
            onChange={(e) => onChange(e.target.value)}
            rows={5}
            className="w-full bg-transparent p-3 font-mono text-xs text-foreground placeholder:text-muted focus:outline-none resize-y"
            placeholder="Write markdown with # Heading, - list, > quote…"
          />
        ) : (
          <div className="p-3 text-xs leading-relaxed bg-surface/50 min-h-[120px]">
            {value.trim() ? (
              renderMarkdown(value)
            ) : (
              <span className="text-muted italic">Nothing to preview</span>
            )}
          </div>
        )}
      </div>

      {helperText && <p className="text-[11px] text-muted">{helperText}</p>}
    </div>
  );
}
