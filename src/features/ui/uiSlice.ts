import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

export interface ToastAction {
  label: string;
  action: 'dismiss' | 'signout';
}

export interface Toast {
  id: string;
  title: string;
  description?: string;
  variant: 'default' | 'success' | 'error' | 'warning';
  actions?: ToastAction[];
}

interface UiState {
  settingsOpen: boolean;
  paletteOpen: boolean;
  shortcutsOpen: boolean;
  sidebarCollapsed: boolean;
  mobileNavOpen: boolean;
  activeSection: string;
  loadingCount: number;
  toasts: Toast[];
}

const initialState: UiState = {
  settingsOpen: false,
  paletteOpen: false,
  shortcutsOpen: false,
  sidebarCollapsed: false,
  mobileNavOpen: false,
  activeSection: 'section-f',
  loadingCount: 0,
  toasts: [],
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    openSettings(state) {
      state.settingsOpen = true;
      state.paletteOpen = false;
      state.shortcutsOpen = false;
    },
    closeSettings(state) {
      state.settingsOpen = false;
    },
    openPalette(state) {
      state.paletteOpen = true;
      state.shortcutsOpen = false;
    },
    closePalette(state) {
      state.paletteOpen = false;
    },
    openShortcuts(state) {
      state.shortcutsOpen = true;
      state.paletteOpen = false;
    },
    closeShortcuts(state) {
      state.shortcutsOpen = false;
    },
    toggleSidebar(state) {
      state.sidebarCollapsed = !state.sidebarCollapsed;
    },
    setMobileNav(state, action: PayloadAction<boolean>) {
      state.mobileNavOpen = action.payload;
    },
    setActiveSection(state, action: PayloadAction<string>) {
      state.activeSection = action.payload;
    },
    pushToast(state, action: PayloadAction<Omit<Toast, 'id'>>) {
      state.toasts.push({ id: crypto.randomUUID(), ...action.payload });
    },
    dismissToast(state, action: PayloadAction<string>) {
      state.toasts = state.toasts.filter((t) => t.id !== action.payload);
    },
    beginLoading(state) {
      state.loadingCount += 1;
    },
    endLoading(state) {
      state.loadingCount = Math.max(0, state.loadingCount - 1);
    },
  },
});

export const {
  openSettings,
  closeSettings,
  openPalette,
  closePalette,
  openShortcuts,
  closeShortcuts,
  toggleSidebar,
  setMobileNav,
  setActiveSection,
  pushToast,
  dismissToast,
  beginLoading,
  endLoading,
} = uiSlice.actions;

export default uiSlice.reducer;
