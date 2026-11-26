export type ThemeMode = 'light' | 'dark' | 'system';
export type Radius = 'none' | 'sm' | 'md' | 'lg' | 'xl' | 'full';
export type Density = 'compact' | 'comfortable' | 'spacious';
export type Shadow = 'none' | 'soft' | 'medium' | 'strong';
export type SidebarStyle = 'full' | 'mini' | 'floating' | 'topnav';
export type ContentWidth = 'fluid' | 'boxed';
export type MotionSpeed = 'slow' | 'normal' | 'fast';
export type Direction = 'ltr' | 'rtl';

export interface SettingsColors {
  primary: string;
  secondary: string;
  accent: string;
  success: string;
  warning: string;
  danger: string;
  background: string;
  surface: string;
}

export interface SettingsFont {
  family: string;
  size: number;
  weight: number;
  lineHeight: number;
  letterSpacing: number;
}

export interface SettingsLayout {
  sidebarPosition: 'left' | 'right';
  sidebarStyle: SidebarStyle;
  contentWidth: ContentWidth;
  stickyHeader: boolean;
  breadcrumbs: boolean;
  footer: boolean;
}

export interface SettingsMotion {
  enabled: boolean;
  speed: MotionSpeed;
  respectReducedMotion: boolean;
}

export interface SettingsLocale {
  language: 'en' | 'hi';
  direction: Direction;
  dateFormat: string;
  timezone: string;
}

export interface SettingsTable {
  pageSize: number;
  density: Density;
  striped: boolean;
}

export interface Settings {
  mode: ThemeMode;
  highContrast: boolean;
  colors: SettingsColors;
  presetId: string;
  font: SettingsFont;
  radius: Radius;
  density: Density;
  shadow: Shadow;
  layout: SettingsLayout;
  motion: SettingsMotion;
  locale: SettingsLocale;
  table: SettingsTable;
}
