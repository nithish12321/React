import { createListenerMiddleware } from '@reduxjs/toolkit';
import type { RootState, AppDispatch } from './store';
import { loggedOut, credentialsReceived, clearJustSignedOut } from '@/features/auth/authSlice';
import { pushToast } from '@/features/ui/uiSlice';
import { logEntry } from '@/features/actionLog/actionLogSlice';
import { addNotification } from '@/features/notifications/notificationsSlice';

export const LOGOUT_EVENT = 'app:force-logout';

export const listenerMiddleware = createListenerMiddleware();
const start = listenerMiddleware.startListening.withTypes<RootState, AppDispatch>();

/** Fire the router redirect exactly once per sign-out, then clear the flag. */
start({
  actionCreator: loggedOut,
  effect: (_action, api) => {
    api.dispatch(pushToast({ title: 'Signed out', variant: 'default' }));
    window.dispatchEvent(new CustomEvent(LOGOUT_EVENT));
    api.dispatch(clearJustSignedOut());
  },
});

/** Auto-logout when the access token expiry passes. */
start({
  predicate: (_action, currentState, previousState) => {
    const prev = previousState.auth.expiresAt;
    const curr = currentState.auth.expiresAt;
    return curr !== null && curr !== prev && curr <= Date.now();
  },
  effect: (_action, api) => {
    api.dispatch(loggedOut());
    api.dispatch(
      pushToast({
        title: 'Session expired — please sign in again',
        variant: 'warning',
      }),
    );
    window.dispatchEvent(new CustomEvent(LOGOUT_EVENT));
  },
});

/** Notify on successful sign-in. */
start({
  actionCreator: credentialsReceived,
  effect: (action, api) => {
    api.dispatch(
      addNotification({
        title: 'Signed in',
        body: `Welcome, ${action.payload.email}`,
      }),
    );
  },
});

/** Demo breadcrumb: every non-log action lands in the action log. */
start({
  predicate: (action) => !action.type.startsWith('actionLog/'),
  effect: (action, api) => {
    const kind = action.type.startsWith('auth/')
      ? 'auth'
      : action.type.startsWith('showcaseApi/')
        ? 'http'
        : 'action';
    api.dispatch(logEntry({ text: action.type, kind }));
  },
});
