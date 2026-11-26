import { useTranslation } from 'react-i18next';
import { Settings, Keyboard, LogOut, ChevronLeft, ChevronRight, X, Sparkles } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '@/app/hooks';
import {
  toggleSidebar,
  setMobileNav,
  openSettings,
  openShortcuts,
  setActiveSection,
} from '@/features/ui/uiSlice';
import { loggedOut } from '@/features/auth/authSlice';
import { cn } from '@/lib/utils';
import { SHOWCASE_SECTIONS } from './sidebarSections';

export function Sidebar() {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const collapsed = useAppSelector((s) => s.ui.sidebarCollapsed);
  const mobileOpen = useAppSelector((s) => s.ui.mobileNavOpen);
  const activeSection = useAppSelector((s) => s.ui.activeSection);
  const sidebarPosition = useAppSelector((s) => s.settings.value.layout.sidebarPosition);

  const handleNavClick = (sectionId: string) => {
    dispatch(setActiveSection(sectionId));
    dispatch(setMobileNav(false));
    const el = document.getElementById(sectionId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const navContent = (
    <div className="flex h-full flex-col justify-between p-3">
      <div className="space-y-6">
        {/* Brand Header */}
        <div className="flex items-center justify-between px-2 py-1">
          <div className="flex items-center gap-2.5 overflow-hidden">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary text-primary-fg shadow-soft">
              <Sparkles className="h-4 w-4" aria-hidden />
            </div>
            {!collapsed && (
              <div className="min-w-0">
                <span className="truncate text-sm font-bold tracking-tight text-foreground block">
                  {t('app.title')}
                </span>
                <span className="text-[11px] font-medium text-muted block">v0.2 · Phase 2</span>
              </div>
            )}
          </div>
          <button
            type="button"
            onClick={() => dispatch(setMobileNav(false))}
            className="rounded-md p-1 text-muted hover:bg-muted-surface lg:hidden"
            aria-label={t('nav.closeMenu')}
          >
            <X className="h-5 w-5" aria-hidden />
          </button>
        </div>

        {/* Sections Navigation */}
        <nav className="space-y-1">
          {!collapsed && (
            <div className="px-2 pb-1.5 text-[11px] font-semibold uppercase tracking-wider text-muted">
              {t('nav.sections')}
            </div>
          )}
          {SHOWCASE_SECTIONS.map((sec) => {
            const Icon = sec.icon;
            const isActive = activeSection === sec.id;
            return (
              <button
                key={sec.id}
                type="button"
                onClick={() => handleNavClick(sec.id)}
                title={collapsed ? `${sec.letter} · ${sec.name}` : undefined}
                className={cn(
                  'flex w-full items-center gap-2.5 rounded-md px-2.5 py-2 text-xs font-medium transition-colors text-start',
                  isActive
                    ? 'bg-primary text-primary-fg font-semibold shadow-soft'
                    : 'text-foreground hover:bg-muted-surface',
                  collapsed && 'justify-center px-0',
                )}
              >
                <Icon className="h-4 w-4 shrink-0" aria-hidden />
                {!collapsed && (
                  <div className="flex flex-1 items-center justify-between min-w-0">
                    <span className="truncate">
                      <span className="opacity-70 mr-1.5 font-bold">{sec.letter} ·</span>
                      {sec.name}
                    </span>
                    {sec.live ? (
                      <span
                        className={cn(
                          'rounded px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide',
                          isActive
                            ? 'bg-primary-fg/20 text-primary-fg'
                            : 'bg-primary/10 text-primary',
                        )}
                      >
                        Live
                      </span>
                    ) : (
                      <span className="text-[10px] text-muted opacity-75">Phase 3+</span>
                    )}
                  </div>
                )}
              </button>
            );
          })}
        </nav>

        {/* General / System Group */}
        <div className="space-y-1 pt-2 border-t border-border">
          {!collapsed && (
            <div className="px-2 pb-1.5 text-[11px] font-semibold uppercase tracking-wider text-muted">
              {t('nav.general')}
            </div>
          )}
          <button
            type="button"
            onClick={() => dispatch(openSettings())}
            title={collapsed ? t('topbar.settings') : undefined}
            className={cn(
              'flex w-full items-center gap-2.5 rounded-md px-2.5 py-2 text-xs font-medium text-foreground hover:bg-muted-surface transition-colors',
              collapsed && 'justify-center px-0',
            )}
          >
            <Settings className="h-4 w-4 shrink-0 text-muted" aria-hidden />
            {!collapsed && <span>{t('topbar.settings')}</span>}
          </button>
          <button
            type="button"
            onClick={() => dispatch(openShortcuts())}
            title={collapsed ? t('shortcuts.title') : undefined}
            className={cn(
              'flex w-full items-center gap-2.5 rounded-md px-2.5 py-2 text-xs font-medium text-foreground hover:bg-muted-surface transition-colors',
              collapsed && 'justify-center px-0',
            )}
          >
            <Keyboard className="h-4 w-4 shrink-0 text-muted" aria-hidden />
            {!collapsed && (
              <div className="flex flex-1 items-center justify-between">
                <span>{t('shortcuts.title')}</span>
                <kbd className="rounded border border-border bg-muted-surface px-1.5 py-0.5 text-[10px] text-muted">
                  ?
                </kbd>
              </div>
            )}
          </button>
        </div>
      </div>

      {/* Footer / User actions & Collapse Toggle */}
      <div className="space-y-2 border-t border-border pt-3">
        <button
          type="button"
          onClick={() => dispatch(loggedOut())}
          title={collapsed ? t('nav.signOut') : undefined}
          className={cn(
            'flex w-full items-center gap-2.5 rounded-md px-2.5 py-2 text-xs font-medium text-danger hover:bg-danger/10 transition-colors',
            collapsed && 'justify-center px-0',
          )}
        >
          <LogOut className="h-4 w-4 shrink-0" aria-hidden />
          {!collapsed && <span>{t('nav.signOut')}</span>}
        </button>

        <button
          type="button"
          onClick={() => dispatch(toggleSidebar())}
          className={cn(
            'hidden lg:flex w-full items-center justify-center rounded-md border border-border bg-surface p-1.5 text-xs text-muted hover:bg-muted-surface transition-colors',
          )}
          aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {collapsed ? (
            sidebarPosition === 'right' ? (
              <ChevronLeft className="h-4 w-4" />
            ) : (
              <ChevronRight className="h-4 w-4" />
            )
          ) : sidebarPosition === 'right' ? (
            <ChevronRight className="h-4 w-4" />
          ) : (
            <ChevronLeft className="h-4 w-4" />
          )}
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile Drawer Backdrop */}
      {mobileOpen && (
        <div
          role="presentation"
          onClick={() => dispatch(setMobileNav(false))}
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-xs transition-opacity lg:hidden"
        />
      )}

      {/* Mobile Drawer */}
      <aside
        className={cn(
          'fixed inset-y-0 z-50 flex w-72 flex-col bg-surface border-border shadow-strong transition-transform duration-300 ease-in-out lg:hidden',
          sidebarPosition === 'right' ? 'right-0 border-l' : 'left-0 border-r',
          mobileOpen
            ? 'translate-x-0'
            : sidebarPosition === 'right'
              ? 'translate-x-full'
              : '-translate-x-full',
        )}
      >
        {navContent}
      </aside>

      {/* Desktop Sidebar */}
      <aside
        className={cn(
          'hidden lg:flex flex-col shrink-0 border-border bg-surface transition-all duration-200 sticky top-0 h-screen overflow-y-auto',
          sidebarPosition === 'right' ? 'border-l' : 'border-r',
          collapsed ? 'w-16' : 'w-64',
        )}
      >
        {navContent}
      </aside>
    </>
  );
}
