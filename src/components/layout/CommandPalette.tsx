import { useState, useEffect, useMemo, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Search,
  FileText,
  Table2,
  Layers,
  Compass,
  BarChart3,
  Zap,
  Wrench,
  Moon,
  Sun,
  Settings,
  Keyboard,
  LogOut,
  ArrowRightLeft,
  X,
  Play,
} from 'lucide-react';
import { useAppDispatch, useAppSelector } from '@/app/hooks';
import {
  closePalette,
  openSettings,
  openShortcuts,
  setActiveSection,
  pushToast,
} from '@/features/ui/uiSlice';
import { setMode, setLocale } from '@/features/settings/settingsSlice';
import { loggedOut } from '@/features/auth/authSlice';
import { runScenario } from '@/features/showcase/api/scenarios';
import { clearLog } from '@/features/actionLog/actionLogSlice';
import { cn } from '@/lib/utils';

interface CommandItem {
  id: string;
  title: string;
  group: 'navigate' | 'actions';
  icon: React.ComponentType<{ className?: string }>;
  action: () => void;
  keywords?: string[];
}

export function CommandPalette() {
  const { t, i18n } = useTranslation();
  const dispatch = useAppDispatch();
  const open = useAppSelector((s) => s.ui.paletteOpen);
  const mode = useAppSelector((s) => s.settings.value.mode);
  const locale = useAppSelector((s) => s.settings.value.locale);

  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open) {
      setQuery('');
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [open]);

  const items: CommandItem[] = useMemo(
    () => [
      // Navigation
      {
        id: 'nav-a',
        title: 'Section A · Forms',
        group: 'navigate',
        icon: FileText,
        action: () => {
          dispatch(setActiveSection('section-a'));
          document.getElementById('section-a')?.scrollIntoView({ behavior: 'smooth' });
        },
      },
      {
        id: 'nav-b',
        title: 'Section B · Data Table',
        group: 'navigate',
        icon: Table2,
        action: () => {
          dispatch(setActiveSection('section-b'));
          document.getElementById('section-b')?.scrollIntoView({ behavior: 'smooth' });
        },
      },
      {
        id: 'nav-c',
        title: 'Section C · Overlays & Feedback',
        group: 'navigate',
        icon: Layers,
        action: () => {
          dispatch(setActiveSection('section-c'));
          document.getElementById('section-c')?.scrollIntoView({ behavior: 'smooth' });
        },
      },
      {
        id: 'nav-d',
        title: 'Section D · Navigation',
        group: 'navigate',
        icon: Compass,
        action: () => {
          dispatch(setActiveSection('section-d'));
          document.getElementById('section-d')?.scrollIntoView({ behavior: 'smooth' });
        },
      },
      {
        id: 'nav-e',
        title: 'Section E · Data Display & Charts',
        group: 'navigate',
        icon: BarChart3,
        action: () => {
          dispatch(setActiveSection('section-e'));
          document.getElementById('section-e')?.scrollIntoView({ behavior: 'smooth' });
        },
      },
      {
        id: 'nav-f',
        title: 'Section F · Redux & API (Live)',
        group: 'navigate',
        icon: Zap,
        action: () => {
          dispatch(setActiveSection('section-f'));
          document.getElementById('section-f')?.scrollIntoView({ behavior: 'smooth' });
        },
      },
      {
        id: 'nav-g',
        title: 'Section G · Utilities',
        group: 'navigate',
        icon: Wrench,
        action: () => {
          dispatch(setActiveSection('section-g'));
          document.getElementById('section-g')?.scrollIntoView({ behavior: 'smooth' });
        },
      },

      // Actions
      {
        id: 'act-theme',
        title: `Switch Theme (Current: ${mode})`,
        group: 'actions',
        icon: mode === 'dark' ? Sun : Moon,
        action: () => {
          const next = mode === 'dark' ? 'light' : 'dark';
          dispatch(setMode(next));
          dispatch(pushToast({ title: `Theme switched to ${next}`, variant: 'default' }));
        },
      },
      {
        id: 'act-lang',
        title: `Switch Language (${locale.language === 'en' ? 'हिंदी (Hindi)' : 'English'})`,
        group: 'actions',
        icon: ArrowRightLeft,
        action: () => {
          const next = locale.language === 'en' ? 'hi' : 'en';
          dispatch(setLocale({ language: next }));
          void i18n.changeLanguage(next);
        },
      },
      {
        id: 'act-rtl',
        title: `Toggle Direction (Current: ${locale.direction.toUpperCase()})`,
        group: 'actions',
        icon: ArrowRightLeft,
        action: () => {
          const next = locale.direction === 'ltr' ? 'rtl' : 'ltr';
          dispatch(setLocale({ direction: next }));
        },
      },
      {
        id: 'act-settings',
        title: t('topbar.settings'),
        group: 'actions',
        icon: Settings,
        action: () => dispatch(openSettings()),
      },
      {
        id: 'act-shortcuts',
        title: t('shortcuts.title'),
        group: 'actions',
        icon: Keyboard,
        action: () => dispatch(openShortcuts()),
      },
      {
        id: 'act-sc-success',
        title: 'API Scenario: Success (200 OK)',
        group: 'actions',
        icon: Play,
        action: () => void runScenario('success'),
      },
      {
        id: 'act-sc-401',
        title: 'API Scenario: Force 401 (Refresh Flow)',
        group: 'actions',
        icon: Play,
        action: () => void runScenario('401'),
      },
      {
        id: 'act-clear-log',
        title: 'Clear Action Log',
        group: 'actions',
        icon: X,
        action: () => dispatch(clearLog()),
      },
      {
        id: 'act-logout',
        title: t('nav.signOut'),
        group: 'actions',
        icon: LogOut,
        action: () => dispatch(loggedOut()),
      },
    ],
    [dispatch, mode, locale, t, i18n],
  );

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return items;
    return items.filter(
      (item) =>
        item.title.toLowerCase().includes(q) ||
        item.group.toLowerCase().includes(q) ||
        item.keywords?.some((k) => k.toLowerCase().includes(q)),
    );
  }, [items, query]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev + 1) % (filtered.length || 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev - 1 + filtered.length) % (filtered.length || 1));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      const item = filtered[selectedIndex];
      if (item) {
        dispatch(closePalette());
        item.action();
      }
    } else if (e.key === 'Escape') {
      e.preventDefault();
      dispatch(closePalette());
    }
  };

  if (!open) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-start justify-center pt-20 p-4 bg-black/60 backdrop-blur-xs"
      onClick={() => dispatch(closePalette())}
    >
      <div
        className="w-full max-w-xl rounded-xl border border-border bg-surface shadow-strong overflow-hidden animate-in fade-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center border-b border-border px-3">
          <Search className="h-4 w-4 shrink-0 text-muted" aria-hidden />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSelectedIndex(0);
            }}
            onKeyDown={handleKeyDown}
            placeholder={t('palette.placeholder')}
            className="w-full bg-transparent px-3 py-3 text-sm text-foreground placeholder:text-muted focus:outline-none"
          />
          <kbd className="rounded border border-border bg-muted-surface px-1.5 py-0.5 text-[10px] text-muted font-mono">
            ESC
          </kbd>
        </div>

        <div className="max-h-80 overflow-y-auto p-2 space-y-1">
          {filtered.length === 0 ? (
            <div className="py-8 text-center text-xs text-muted">{t('palette.empty')}</div>
          ) : (
            filtered.map((item, index) => {
              const Icon = item.icon;
              const isSelected = index === selectedIndex;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => {
                    dispatch(closePalette());
                    item.action();
                  }}
                  onMouseEnter={() => setSelectedIndex(index)}
                  className={cn(
                    'flex w-full items-center justify-between rounded-lg px-3 py-2 text-xs font-medium transition-colors text-start',
                    isSelected
                      ? 'bg-primary text-primary-fg font-semibold'
                      : 'text-foreground hover:bg-muted-surface',
                  )}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <Icon className="h-4 w-4 shrink-0 opacity-80" />
                    <span className="truncate">{item.title}</span>
                  </div>
                  <span
                    className={cn(
                      'text-[10px] uppercase tracking-wider',
                      isSelected ? 'text-primary-fg/80' : 'text-muted',
                    )}
                  >
                    {item.group}
                  </span>
                </button>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
