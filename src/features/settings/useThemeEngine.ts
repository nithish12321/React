import { useEffect } from 'react';
import { applySettings } from './themeEngine';
import type { RootState } from '@/app/rootReducer';
import { useAppSelector } from '@/app/hooks';

/** Applies settings to CSS variables on every change, and tracks the system theme. */
export function useThemeEngine(): void {
  const settings = useAppSelector((s: RootState) => s.settings.value);

  useEffect(() => {
    applySettings(settings);
  }, [settings]);

  useEffect(() => {
    if (settings.mode !== 'system' || !window.matchMedia) return;
    const mq = window.matchMedia('(prefers-color-scheme: dark)');
    const onChange = () => applySettings(settings);
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, [settings]);
}
