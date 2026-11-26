import { type ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { Lock } from 'lucide-react';

interface PlaceholderSectionProps {
  id: string;
  letter: string;
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  phase?: string;
  children?: ReactNode;
}

export function PlaceholderSection({
  id,
  letter,
  title,
  description,
  icon: Icon,
  phase = 'Phase 3+',
  children,
}: PlaceholderSectionProps) {
  const { t } = useTranslation();

  return (
    <section
      id={id}
      className="scroll-mt-20 rounded-xl border border-border bg-surface p-6 shadow-soft transition-all"
    >
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-5 border-b border-border">
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-muted-surface text-foreground font-bold text-sm border border-border">
            {letter}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <Icon className="h-4 w-4 text-muted" aria-hidden />
              <h2 className="text-lg font-bold text-foreground">{title}</h2>
            </div>
            <p className="mt-1 text-xs text-muted max-w-2xl">{description}</p>
          </div>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-center">
          <span className="flex items-center gap-1.5 rounded-full border border-border bg-muted-surface px-2.5 py-1 text-xs font-medium text-muted">
            <Lock className="h-3 w-3" />
            <span>{phase}</span>
          </span>
        </div>
      </div>

      {/* Content Area */}
      <div className="mt-6">
        {children ? (
          children
        ) : (
          <div className="rounded-lg border border-dashed border-border bg-muted-surface/40 p-8 text-center">
            <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-surface border border-border text-muted">
              <Icon className="h-5 w-5" />
            </div>
            <h3 className="mt-3 text-sm font-semibold text-foreground">{t('laterPhase.title')}</h3>
            <p className="mt-1 text-xs text-muted max-w-sm mx-auto">
              {t('laterPhase.body')} ({phase})
            </p>
            <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-3 max-w-lg mx-auto">
              <div className="h-16 rounded-md bg-surface/70 border border-border animate-pulse" />
              <div className="h-16 rounded-md bg-surface/70 border border-border animate-pulse" />
              <div className="h-16 rounded-md bg-surface/70 border border-border animate-pulse" />
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
