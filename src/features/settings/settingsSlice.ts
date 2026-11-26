import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import { DEFAULT_SETTINGS } from './presets';
import type { Settings } from './types';
import type { ThemePreset } from './presets';

interface SettingsState {
  value: Settings;
  presetId: string;
  customColors: Settings['colors'] | null;
}

const initialState: SettingsState = {
  value: DEFAULT_SETTINGS,
  presetId: DEFAULT_SETTINGS.presetId,
  customColors: null,
};

export interface PresetPayload {
  preset: ThemePreset;
}

const settingsSlice = createSlice({
  name: 'settings',
  initialState,
  reducers: {
    setMode(state, action: PayloadAction<Settings['mode']>) {
      state.value.mode = action.payload;
    },
    setHighContrast(state, action: PayloadAction<boolean>) {
      state.value.highContrast = action.payload;
    },
    setColor(state, action: PayloadAction<{ key: keyof Settings['colors']; value: string }>) {
      state.value.colors[action.payload.key] = action.payload.value;
      state.customColors = state.value.colors;
      state.presetId = 'custom';
      state.value.presetId = 'custom';
    },
    applyPreset(state, action: PayloadAction<ThemePreset>) {
      state.presetId = action.payload.id;
      state.value.presetId = action.payload.id;
      state.customColors = null;
    },
    setFont(state, action: PayloadAction<Partial<Settings['font']>>) {
      state.value.font = { ...state.value.font, ...action.payload };
    },
    setRadius(state, action: PayloadAction<Settings['radius']>) {
      state.value.radius = action.payload;
    },
    setDensity(state, action: PayloadAction<Settings['density']>) {
      state.value.density = action.payload;
    },
    setShadow(state, action: PayloadAction<Settings['shadow']>) {
      state.value.shadow = action.payload;
    },
    setLayout(state, action: PayloadAction<Partial<Settings['layout']>>) {
      state.value.layout = { ...state.value.layout, ...action.payload };
    },
    setMotion(state, action: PayloadAction<Partial<Settings['motion']>>) {
      state.value.motion = { ...state.value.motion, ...action.payload };
    },
    setLocale(state, action: PayloadAction<Partial<Settings['locale']>>) {
      state.value.locale = { ...state.value.locale, ...action.payload };
    },
    setTable(state, action: PayloadAction<Partial<Settings['table']>>) {
      state.value.table = { ...state.value.table, ...action.payload };
    },
    importSettings(state, action: PayloadAction<Settings>) {
      state.value = action.payload;
      state.presetId = action.payload.presetId;
      state.customColors = action.payload.presetId === 'custom' ? action.payload.colors : null;
    },
    resetSettings() {
      return initialState;
    },
  },
});

export const {
  setMode,
  setHighContrast,
  setColor,
  applyPreset,
  setFont,
  setRadius,
  setDensity,
  setShadow,
  setLayout,
  setMotion,
  setLocale,
  setTable,
  importSettings,
  resetSettings,
} = settingsSlice.actions;

export default settingsSlice.reducer;
