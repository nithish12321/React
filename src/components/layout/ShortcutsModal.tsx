import { useTranslation } from 'react-i18next';
import { Keyboard, X } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '@/app/hooks';
import { closeShortcuts } from '@/features/ui/uiSlice';

export function ShortcutsModal() {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const open = useAppSelector((s) => s.ui.shortcutsOpen);

  if (!open) return null;

  const shortcuts = [
    { key: 'Ctrl + K / ⌘ + K', desc: t('shortcuts.palette') },
    { key: '?', desc: t('shortcuts.shortcuts') },
    { key: 'Alt + T', desc: t('shortcuts.theme') },
    { key: 'Alt + S', desc: t('shortcuts.settings') },
    { key: 'Alt + L', desc: 'Toggle Language (EN / HI)' },
    { key: 'Esc', desc: t('shortcuts.close') },
  ];

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs"
      onClick={() => dispatch(closeShortcuts())}
    >
      <div
        className="w-full max-w-md rounded-xl border border-border bg-surface p-6 shadow-strong animate-in fade-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between pb-4 border-b border-border">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <Keyboard className="h-4 w-4" aria-hidden />
            </div>
            <h2 className="text-base font-semibold text-foreground">{t('shortcuts.title')}</h2>
          </div>
          <button
            type="button"
            onClick={() => dispatch(closeShortcuts())}
            className="rounded-md p-1 text-muted hover:bg-muted-surface"
            aria-label={t('shortcuts.close')}
          >
            <X className="h-4 w-4" aria-hidden />
          </button>
        </div>

        <div className="mt-4 divide-y divide-border">
          {shortcuts.map((sc) => (
            <div key={sc.key} className="flex items-center justify-between py-2.5 text-xs">
              <span className="text-foreground">{sc.desc}</span>
              <kbd className="rounded border border-border bg-muted-surface px-2 py-1 font-mono font-medium text-muted text-[11px]">
                {sc.key}
              </kbd>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
