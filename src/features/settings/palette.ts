import { getPreset } from './presets';
import type { Settings } from './types';

/** Resolves the palette in effect right now: custom colors, or the preset for the resolved mode. */
export function activePalette(
  settings: Settings,
  resolvedMode: 'light' | 'dark',
): Settings['colors'] {
  if (settings.presetId === 'custom') return settings.colors;
  const preset = getPreset(settings.presetId);
  return resolvedMode === 'dark' ? preset.darkColors : preset.colors;
}
