import { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Menu,
  Search,
  Bell,
  Sun,
  Moon,
  Monitor,
  Settings,
  Languages,
  Check,
  User,
  LogOut,
  ArrowRightLeft,
} from 'lucide-react';
import { useAppDispatch, useAppSelector } from '@/app/hooks';
import { setMobileNav, openPalette, openSettings, pushToast } from '@/features/ui/uiSlice';
import { setMode, setLocale } from '@/features/settings/settingsSlice';
import { markAllRead } from '@/features/notifications/notificationsSlice';
import { loggedOut } from '@/features/auth/authSlice';
import { Breadcrumbs } from './Breadcrumbs';
import { cn } from '@/lib/utils';
import type { ThemeMode } from '@/features/settings/types';

export function Topbar() {
  const { t, i18n } = useTranslation();
  const dispatch = useAppDispatch();
  const email = useAppSelector((s) => s.auth.email);
  const mode = useAppSelector((s) => s.settings.value.mode);
  const locale = useAppSelector((s) => s.settings.value.locale);
  const notifications = useAppSelector((s) => s.notifications.items);
  const sticky = useAppSelector((s) => s.settings.value.layout.stickyHeader);

  const [notifOpen, setNotifOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [langOpen, setLangOpen] = useState(false);

  const notifRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);
  const langRef = useRef<HTMLDivElement>(null);

  const unreadCount = notifications.filter((n) => !n.read).length;

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) setNotifOpen(false);
      if (profileRef.current && !profileRef.current.contains(e.target as Node))
        setProfileOpen(false);
      if (langRef.current && !langRef.current.contains(e.target as Node)) setLangOpen(false);
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const cycleTheme = () => {
    const next: Record<ThemeMode, ThemeMode> = { light: 'dark', dark: 'system', system: 'light' };
    const newMode = next[mode];
    dispatch(setMode(newMode));
    dispatch(pushToast({ title: `Theme: ${newMode}`, variant: 'default' }));
  };

  const themeIcon = {
    light: <Sun className="h-4 w-4" aria-hidden />,
    dark: <Moon className="h-4 w-4" aria-hidden />,
    system: <Monitor className="h-4 w-4" aria-hidden />,
  }[mode];

  return (
    <header
      className={cn(
        'z-30 flex h-14 w-full items-center justify-between border-b border-border bg-surface/90 px-4 backdrop-blur-md transition-colors',
        sticky && 'sticky top-0',
      )}
    >
      {/* Left: Mobile Toggle & Breadcrumbs */}
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={() => dispatch(setMobileNav(true))}
          className="rounded-md p-1.5 text-muted hover:bg-muted-surface lg:hidden"
          aria-label={t('nav.openMenu')}
        >
          <Menu className="h-5 w-5" aria-hidden />
        </button>
        <Breadcrumbs />
      </div>

      {/* Right: Actions */}
      <div className="flex items-center gap-1.5 sm:gap-2">
        {/* Command Palette Trigger */}
        <button
          type="button"
          onClick={() => dispatch(openPalette())}
          className="flex items-center gap-2 rounded-md border border-border bg-muted-surface px-2.5 py-1.5 text-xs text-muted hover:border-primary/50 transition-colors"
          aria-label={t('shortcuts.palette')}
        >
          <Search className="h-3.5 w-3.5" aria-hidden />
          <span className="hidden sm:inline">{t('topbar.search')}</span>
          <kbd className="hidden sm:inline rounded border border-border bg-surface px-1.5 py-0.5 text-[10px] font-semibold text-muted">
            {t('topbar.searchHint')}
          </kbd>
        </button>

        {/* Language & Direction Switcher Dropdown */}
        <div className="relative" ref={langRef}>
          <button
            type="button"
            onClick={() => setLangOpen((v) => !v)}
            className="flex items-center gap-1 rounded-md p-1.5 text-muted hover:bg-muted-surface hover:text-foreground transition-colors"
            aria-label={t('topbar.language')}
          >
            <Languages className="h-4 w-4" aria-hidden />
            <span className="text-xs font-semibold uppercase">{locale.language}</span>
          </button>
          {langOpen && (
            <div className="absolute end-0 mt-2 w-48 rounded-lg border border-border bg-surface p-1 shadow-medium ring-1 ring-border z-50">
              <div className="px-2 py-1 text-[11px] font-semibold uppercase tracking-wider text-muted">
                {t('topbar.language')}
              </div>
              <button
                type="button"
                onClick={() => {
                  dispatch(setLocale({ language: 'en' }));
                  void i18n.changeLanguage('en');
                  setLangOpen(false);
                }}
                className="flex w-full items-center justify-between rounded-md px-2 py-1.5 text-xs hover:bg-muted-surface"
              >
                <span>English</span>
                {locale.language === 'en' && <Check className="h-3.5 w-3.5 text-primary" />}
              </button>
              <button
                type="button"
                onClick={() => {
                  dispatch(setLocale({ language: 'hi' }));
                  void i18n.changeLanguage('hi');
                  setLangOpen(false);
                }}
                className="flex w-full items-center justify-between rounded-md px-2 py-1.5 text-xs hover:bg-muted-surface"
              >
                <span>हिंदी (Hindi)</span>
                {locale.language === 'hi' && <Check className="h-3.5 w-3.5 text-primary" />}
              </button>
              <div className="my-1 border-t border-border" />
              <button
                type="button"
                onClick={() => {
                  const nextDir = locale.direction === 'ltr' ? 'rtl' : 'ltr';
                  dispatch(setLocale({ direction: nextDir }));
                  setLangOpen(false);
                }}
                className="flex w-full items-center justify-between rounded-md px-2 py-1.5 text-xs hover:bg-muted-surface"
              >
                <span className="flex items-center gap-1.5">
                  <ArrowRightLeft className="h-3.5 w-3.5 text-muted" />
                  <span>RTL Direction</span>
                </span>
                <span className="rounded bg-muted-surface px-1.5 py-0.5 text-[10px] font-mono uppercase">
                  {locale.direction}
                </span>
              </button>
            </div>
          )}
        </div>

        {/* Theme Mode Toggle */}
        <button
          type="button"
          onClick={cycleTheme}
          className="rounded-md p-1.5 text-muted hover:bg-muted-surface hover:text-foreground transition-colors"
          aria-label={`Toggle theme (current: ${mode})`}
          title={`Theme: ${mode}`}
        >
          {themeIcon}
        </button>

        {/* Notifications Popover */}
        <div className="relative" ref={notifRef}>
          <button
            type="button"
            onClick={() => setNotifOpen((v) => !v)}
            className="relative rounded-md p-1.5 text-muted hover:bg-muted-surface hover:text-foreground transition-colors"
            aria-label={t('topbar.notifications')}
          >
            <Bell className="h-4 w-4" aria-hidden />
            {unreadCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-fg">
                {unreadCount}
              </span>
            )}
          </button>
          {notifOpen && (
            <div className="absolute end-0 mt-2 w-80 rounded-lg border border-border bg-surface shadow-medium ring-1 ring-border z-50">
              <div className="flex items-center justify-between border-b border-border px-3 py-2">
                <span className="text-xs font-semibold">{t('topbar.notifications')}</span>
                {unreadCount > 0 && (
                  <button
                    type="button"
                    onClick={() => dispatch(markAllRead())}
                    className="text-[11px] text-primary hover:underline"
                  >
                    {t('topbar.markAllRead')}
                  </button>
                )}
              </div>
              <div className="max-h-64 overflow-y-auto divide-y divide-border">
                {notifications.length === 0 ? (
                  <div className="p-4 text-center text-xs text-muted">
                    {t('topbar.noNotifications')}
                  </div>
                ) : (
                  notifications.map((n) => (
                    <div
                      key={n.id}
                      className={cn(
                        'p-3 text-xs transition-colors hover:bg-muted-surface',
                        !n.read && 'bg-primary/5',
                      )}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-medium text-foreground">{n.title}</span>
                        {!n.read && <span className="h-1.5 w-1.5 rounded-full bg-primary" />}
                      </div>
                      <p className="mt-0.5 text-muted line-clamp-2">{n.body}</p>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* Settings Gear */}
        <button
          type="button"
          onClick={() => dispatch(openSettings())}
          className="rounded-md p-1.5 text-muted hover:bg-muted-surface hover:text-foreground transition-colors"
          aria-label={t('topbar.settings')}
        >
          <Settings className="h-4 w-4" aria-hidden />
        </button>

        {/* Profile Menu Dropdown */}
        <div className="relative" ref={profileRef}>
          <button
            type="button"
            onClick={() => setProfileOpen((v) => !v)}
            className="flex items-center gap-1.5 rounded-full border border-border bg-surface p-1 hover:ring-2 hover:ring-ring transition-all"
            aria-label={t('topbar.profile')}
          >
            <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/20 text-primary text-xs font-bold">
              {email ? email.slice(0, 2).toUpperCase() : <User className="h-3.5 w-3.5" />}
            </div>
          </button>
          {profileOpen && (
            <div className="absolute end-0 mt-2 w-56 rounded-lg border border-border bg-surface p-1 shadow-medium ring-1 ring-border z-50">
              <div className="px-3 py-2 border-b border-border">
                <p className="text-xs font-semibold text-foreground truncate">{email ?? 'User'}</p>
                <p className="text-[11px] text-muted">Administrator</p>
              </div>
              <button
                type="button"
                onClick={() => {
                  setProfileOpen(false);
                  dispatch(openSettings());
                }}
                className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-xs text-foreground hover:bg-muted-surface"
              >
                <Settings className="h-3.5 w-3.5 text-muted" />
                <span>{t('topbar.settings')}</span>
              </button>
              <div className="my-1 border-t border-border" />
              <button
                type="button"
                onClick={() => {
                  setProfileOpen(false);
                  dispatch(loggedOut());
                }}
                className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-xs text-danger hover:bg-danger/10"
              >
                <LogOut className="h-3.5 w-3.5" />
                <span>{t('nav.signOut')}</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
