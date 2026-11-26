import { useEffect, type ReactNode } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { useAppDispatch, useAppSelector } from '@/app/hooks';
import {
  openPalette,
  closePalette,
  openShortcuts,
  closeShortcuts,
  openSettings,
  closeSettings,
  setMobileNav,
} from '@/features/ui/uiSlice';
import { setMode, setLocale } from '@/features/settings/settingsSlice';
import { Sidebar } from './Sidebar';
import { Topbar } from './Topbar';
import { LoadingBar } from './LoadingBar';
import { CommandPalette } from './CommandPalette';
import { ShortcutsModal } from './ShortcutsModal';
import { ScrollToTop } from './ScrollToTop';
import { cn } from '@/lib/utils';

interface AppShellProps {
  children: ReactNode;
}

export function AppShell({ children }: AppShellProps) {
  const { i18n } = useTranslation();
  const dispatch = useAppDispatch();
  const layout = useAppSelector((s) => s.settings.value.layout);
  const motionConfig = useAppSelector((s) => s.settings.value.motion);
  const mode = useAppSelector((s) => s.settings.value.mode);
  const locale = useAppSelector((s) => s.settings.value.locale);

  // Global keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const activeEl = document.activeElement;
      const isInput =
        activeEl instanceof HTMLInputElement ||
        activeEl instanceof HTMLTextAreaElement ||
        (activeEl instanceof HTMLElement && activeEl.isContentEditable);

      // Ctrl+K / Cmd+K -> Toggle command palette
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        dispatch(openPalette());
        return;
      }

      // ? -> Open keyboard shortcuts (when not in input)
      if (e.key === '?' && !isInput) {
        e.preventDefault();
        dispatch(openShortcuts());
        return;
      }

      // Alt+T -> Cycle theme
      if (e.altKey && e.key.toLowerCase() === 't') {
        e.preventDefault();
        const next = mode === 'dark' ? 'light' : 'dark';
        dispatch(setMode(next));
        return;
      }

      // Alt+S -> Open settings
      if (e.altKey && e.key.toLowerCase() === 's') {
        e.preventDefault();
        dispatch(openSettings());
        return;
      }

      // Alt+L -> Toggle language
      if (e.altKey && e.key.toLowerCase() === 'l') {
        e.preventDefault();
        const next = locale.language === 'en' ? 'hi' : 'en';
        dispatch(setLocale({ language: next }));
        void i18n.changeLanguage(next);
        return;
      }

      // Escape -> Close open drawers / modals
      if (e.key === 'Escape') {
        dispatch(closePalette());
        dispatch(closeShortcuts());
        dispatch(closeSettings());
        dispatch(setMobileNav(false));
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [dispatch, mode, locale, i18n]);

  const motionDuration =
    !motionConfig.enabled ||
    (motionConfig.respectReducedMotion &&
      window.matchMedia?.('(prefers-reduced-motion: reduce)').matches)
      ? 0
      : motionConfig.speed === 'fast'
        ? 0.1
        : motionConfig.speed === 'slow'
          ? 0.3
          : 0.18;

  return (
    <div className="relative min-h-screen bg-background text-foreground flex flex-col font-sans">
      <LoadingBar />

      <div
        className={cn(
          'flex flex-1 min-h-screen',
          layout.sidebarPosition === 'right' ? 'flex-row-reverse' : 'flex-row',
        )}
      >
        <Sidebar />

        <div className="flex flex-1 flex-col min-w-0">
          <Topbar />

          <main className="flex-1">
            <AnimatePresence mode="wait">
              <motion.div
                initial={{ opacity: 0, y: motionDuration > 0 ? 8 : 0 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: motionDuration > 0 ? -8 : 0 }}
                transition={{ duration: motionDuration }}
                className={cn(
                  'w-full px-4 py-6 sm:px-6 lg:px-8',
                  layout.contentWidth === 'boxed' ? 'max-w-7xl mx-auto' : 'w-full',
                )}
              >
                {children}
              </motion.div>
            </AnimatePresence>
          </main>

          {layout.footer && (
            <footer className="border-t border-border py-4 px-6 text-center text-xs text-muted">
              <p>Feature Showcase · Phase 2 Complete (Auth, AppShell, Interceptors, Section F)</p>
            </footer>
          )}
        </div>
      </div>

      <CommandPalette />
      <ShortcutsModal />
      <ScrollToTop />
    </div>
  );
}
