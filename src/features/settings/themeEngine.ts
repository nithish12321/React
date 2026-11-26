import { getPreset } from './presets';
import type { Settings } from './types';

const RADIUS_BASE_PX: Record<Settings['radius'], string> = {
  none: '0',
  sm: '0.25rem',
  md: '0.5rem',
  lg: '0.75rem',
  xl: '1rem',
  full: '9999px',
};

const DENSITY_VARS: Record<Settings['density'], Record<string, string>> = {
  compact: {
    '--density-pad-x': '0.75rem',
    '--density-pad-y': '0.375rem',
    '--density-gap': '0.75rem',
    '--density-row-h': '2.25rem',
  },
  comfortable: {
    '--density-pad-x': '1rem',
    '--density-pad-y': '0.5rem',
    '--density-gap': '1rem',
    '--density-row-h': '2.75rem',
  },
  spacious: {
    '--density-pad-x': '1.5rem',
    '--density-pad-y': '0.75rem',
    '--density-gap': '1.5rem',
    '--density-row-h': '3.25rem',
  },
};

const MOTION_SPEED_MS: Record<Settings['motion']['speed'], string> = {
  slow: '250ms',
  normal: '150ms',
  fast: '75ms',
};

const SHADOW_VAR: Record<Settings['shadow'], string> = {
  none: 'none',
  soft: 'var(--shadow-soft)',
  medium: 'var(--shadow-medium)',
  strong: 'var(--shadow-strong)',
};

function relativeLuminance(hex: string): number {
  const m = hex.replace('#', '');
  const full =
    m.length === 3
      ? m
          .split('')
          .map((c) => c + c)
          .join('')
      : m;
  const r = parseInt(full.slice(0, 2), 16) / 255;
  const g = parseInt(full.slice(2, 4), 16) / 255;
  const b = parseInt(full.slice(4, 6), 16) / 255;
  const lin = (c: number) => (c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4);
  return 0.2126 * lin(r) + 0.7152 * lin(g) + 0.0722 * lin(b);
}

export function contrastRatio(a: string, b: string): number {
  const la = relativeLuminance(a);
  const lb = relativeLuminance(b);
  const lighter = Math.max(la, lb);
  const darker = Math.min(la, lb);
  return (lighter + 0.05) / (darker + 0.05);
}

/** Brand colors the user can edit, checked against the surfaces they appear on. */
export function lowContrastColors(settings: Settings): string[] {
  const names: Array<keyof Settings['colors']> = [
    'primary',
    'secondary',
    'accent',
    'success',
    'warning',
    'danger',
  ];
  const resolvedDark = resolveMode(settings.mode);
  const palette =
    settings.presetId === 'custom'
      ? settings.colors
      : resolvedDark
        ? getPreset(settings.presetId).darkColors
        : getPreset(settings.presetId).colors;
  return names.filter(
    (name) =>
      contrastRatio(palette[name], palette.background) < 4.5 &&
      contrastRatio(palette[name], palette.surface) < 4.5,
  );
}

function resolvePalette(settings: Settings, resolvedDark: 'light' | 'dark') {
  if (settings.presetId === 'custom') return settings.colors;
  const preset = getPreset(settings.presetId);
  return resolvedDark ? preset.darkColors : preset.colors;
}

export function resolveMode(mode: Settings['mode']): 'light' | 'dark' {
  if (mode !== 'system') return mode;
  if (typeof window === 'undefined' || !window.matchMedia) return 'light';
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

export function applySettings(settings: Settings): void {
  const root = document.documentElement;
  const resolvedDark = resolveMode(settings.mode);
  root.classList.toggle('dark', resolvedDark === 'dark');
  root.classList.toggle('hc', settings.highContrast);
  root.style.colorScheme = resolvedDark ? 'dark' : 'light';

  const palette = resolvePalette(settings, resolvedDark);
  for (const [key, value] of Object.entries(palette)) {
    root.style.setProperty(`--color-${key}`, value);
  }

  const style = root.style;
  style.setProperty('--font-sans', `"${settings.font.family}", system-ui, sans-serif`);
  style.setProperty('--font-size-base', `${settings.font.size}px`);
  style.setProperty('--font-weight-base', String(settings.font.weight));
  style.setProperty('--line-height-base', String(settings.font.lineHeight));
  style.setProperty('--letter-spacing-base', `${settings.font.letterSpacing}em`);
  style.setProperty('--radius-base', RADIUS_BASE_PX[settings.radius]);
  style.setProperty('--shadow-current', SHADOW_VAR[settings.shadow]);

  for (const [key, value] of Object.entries(DENSITY_VARS[settings.density])) {
    style.setProperty(key, value);
  }

  root.classList.toggle('motion-off', !settings.motion.enabled);
  style.setProperty('--transition-duration', MOTION_SPEED_MS[settings.motion.speed]);
  if (
    settings.motion.respectReducedMotion &&
    window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
  ) {
    root.classList.add('motion-off');
  }

  root.dir = settings.locale.direction;
  root.lang = settings.locale.language;
}
