import type { Settings } from './types';

export interface ThemePreset {
  id: string;
  name: string;
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    success: string;
    warning: string;
    danger: string;
    background: string;
    surface: string;
  };
  darkColors: {
    primary: string;
    secondary: string;
    accent: string;
    success: string;
    warning: string;
    danger: string;
    background: string;
    surface: string;
  };
}

export const THEME_PRESETS: ThemePreset[] = [
  {
    id: 'ocean',
    name: 'Ocean',
    colors: {
      primary: '#0369a1',
      secondary: '#0e7490',
      accent: '#f59e0b',
      success: '#16a34a',
      warning: '#d97706',
      danger: '#dc2626',
      background: '#f0f9ff',
      surface: '#ffffff',
    },
    darkColors: {
      primary: '#38bdf8',
      secondary: '#22d3ee',
      accent: '#fbbf24',
      success: '#4ade80',
      warning: '#fbbf24',
      danger: '#f87171',
      background: '#0b1220',
      surface: '#111c2e',
    },
  },
  {
    id: 'forest',
    name: 'Forest',
    colors: {
      primary: '#15803d',
      secondary: '#4d7c0f',
      accent: '#ca8a04',
      success: '#16a34a',
      warning: '#d97706',
      danger: '#dc2626',
      background: '#f0fdf4',
      surface: '#ffffff',
    },
    darkColors: {
      primary: '#4ade80',
      secondary: '#a3e635',
      accent: '#facc15',
      success: '#4ade80',
      warning: '#fbbf24',
      danger: '#f87171',
      background: '#0a1409',
      surface: '#122111',
    },
  },
  {
    id: 'sunset',
    name: 'Sunset',
    colors: {
      primary: '#c2410c',
      secondary: '#b91c1c',
      accent: '#7c3aed',
      success: '#16a34a',
      warning: '#d97706',
      danger: '#dc2626',
      background: '#fff7ed',
      surface: '#ffffff',
    },
    darkColors: {
      primary: '#fb923c',
      secondary: '#f87171',
      accent: '#a78bfa',
      success: '#4ade80',
      warning: '#fbbf24',
      danger: '#f87171',
      background: '#170a05',
      surface: '#251209',
    },
  },
  {
    id: 'midnight',
    name: 'Midnight',
    colors: {
      primary: '#1e3a8a',
      secondary: '#3730a3',
      accent: '#0891b2',
      success: '#16a34a',
      warning: '#d97706',
      danger: '#dc2626',
      background: '#eef2ff',
      surface: '#ffffff',
    },
    darkColors: {
      primary: '#818cf8',
      secondary: '#a78bfa',
      accent: '#22d3ee',
      success: '#4ade80',
      warning: '#fbbf24',
      danger: '#f87171',
      background: '#05060f',
      surface: '#0d0f1f',
    },
  },
  {
    id: 'rose',
    name: 'Rose',
    colors: {
      primary: '#be123c',
      secondary: '#a21caf',
      accent: '#f59e0b',
      success: '#16a34a',
      warning: '#d97706',
      danger: '#e11d48',
      background: '#fff1f2',
      surface: '#ffffff',
    },
    darkColors: {
      primary: '#fb7185',
      secondary: '#e879f9',
      accent: '#fbbf24',
      success: '#4ade80',
      warning: '#fbbf24',
      danger: '#fb7185',
      background: '#180810',
      surface: '#241018',
    },
  },
  {
    id: 'slate',
    name: 'Slate',
    colors: {
      primary: '#334155',
      secondary: '#475569',
      accent: '#0ea5e9',
      success: '#16a34a',
      warning: '#d97706',
      danger: '#dc2626',
      background: '#f8fafc',
      surface: '#ffffff',
    },
    darkColors: {
      primary: '#94a3b8',
      secondary: '#cbd5e1',
      accent: '#38bdf8',
      success: '#4ade80',
      warning: '#fbbf24',
      danger: '#f87171',
      background: '#0c0f14',
      surface: '#161b22',
    },
  },
  {
    id: 'violet',
    name: 'Violet',
    colors: {
      primary: '#6d28d9',
      secondary: '#9333ea',
      accent: '#ec4899',
      success: '#16a34a',
      warning: '#d97706',
      danger: '#dc2626',
      background: '#faf5ff',
      surface: '#ffffff',
    },
    darkColors: {
      primary: '#a78bfa',
      secondary: '#c084fc',
      accent: '#f472b6',
      success: '#4ade80',
      warning: '#fbbf24',
      danger: '#f87171',
      background: '#0d0618',
      surface: '#170c28',
    },
  },
  {
    id: 'amber',
    name: 'Amber',
    colors: {
      primary: '#b45309',
      secondary: '#a16207',
      accent: '#0d9488',
      success: '#16a34a',
      warning: '#f59e0b',
      danger: '#dc2626',
      background: '#fffbeb',
      surface: '#ffffff',
    },
    darkColors: {
      primary: '#fbbf24',
      secondary: '#facc15',
      accent: '#2dd4bf',
      success: '#4ade80',
      warning: '#fbbf24',
      danger: '#f87171',
      background: '#151005',
      surface: '#221a08',
    },
  },
];

export function getPreset(id: string): ThemePreset {
  return THEME_PRESETS.find((p) => p.id === id) ?? THEME_PRESETS[0];
}

export const DEFAULT_SETTINGS: Settings = {
  mode: 'light',
  highContrast: false,
  colors: { ...THEME_PRESETS[0].colors },
  presetId: 'ocean',
  font: {
    family: 'Inter',
    size: 16,
    weight: 400,
    lineHeight: 1.5,
    letterSpacing: 0,
  },
  radius: 'md',
  density: 'comfortable',
  shadow: 'soft',
  layout: {
    sidebarPosition: 'left',
    sidebarStyle: 'full',
    contentWidth: 'fluid',
    stickyHeader: true,
    breadcrumbs: true,
    footer: true,
  },
  motion: { enabled: true, speed: 'normal', respectReducedMotion: true },
  locale: {
    language: 'en',
    direction: 'ltr',
    dateFormat: 'yyyy-MM-dd',
    timezone: 'UTC',
  },
  table: { pageSize: 10, density: 'comfortable', striped: false },
};
