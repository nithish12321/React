import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

export type AuthStatus = 'idle' | 'authenticating' | 'authenticated';

interface AuthState {
  status: AuthStatus;
  accessToken: string | null;
  refreshToken: string | null;
  expiresAt: number | null;
  email: string | null;
  rememberMe: boolean;
  justSignedOut: boolean;
}

const initialState: AuthState = {
  status: 'idle',
  accessToken: null,
  refreshToken: null,
  expiresAt: null,
  email: null,
  rememberMe: false,
  justSignedOut: false,
};

export interface LoginRequest {
  email: string;
  password: string;
}

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    authenticating(state) {
      state.status = 'authenticating';
    },
    credentialsReceived(
      state,
      action: PayloadAction<{
        accessToken: string;
        refreshToken: string;
        expiresAt: number;
        email: string;
        rememberMe: boolean;
      }>,
    ) {
      state.status = 'authenticated';
      state.accessToken = action.payload.accessToken;
      state.refreshToken = action.payload.refreshToken;
      state.expiresAt = action.payload.expiresAt;
      state.email = action.payload.email;
      state.rememberMe = action.payload.rememberMe;
      state.justSignedOut = false;
    },
    tokenRefreshed(state, action: PayloadAction<{ accessToken: string; expiresAt: number }>) {
      state.accessToken = action.payload.accessToken;
      state.expiresAt = action.payload.expiresAt;
      state.status = 'authenticated';
    },
    loggedOut(state) {
      state.justSignedOut = state.email !== null;
      state.status = 'idle';
      state.accessToken = null;
      state.refreshToken = null;
      state.expiresAt = null;
      state.email = null;
    },
    clearJustSignedOut(state) {
      state.justSignedOut = false;
    },
  },
});

export const {
  authenticating,
  credentialsReceived,
  tokenRefreshed,
  loggedOut,
  clearJustSignedOut,
} = authSlice.actions;
export default authSlice.reducer;
