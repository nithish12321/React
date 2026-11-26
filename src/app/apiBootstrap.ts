import { getStore } from './storeSingleton';
import { tokenRefreshed, loggedOut } from '@/features/auth/authSlice';
import { bindAuth, setupInterceptors } from '@/lib/interceptors';
import { pushToast } from '@/features/ui/uiSlice';
import { logEntry } from '@/features/actionLog/actionLogSlice';
import i18n from '@/i18n';

const STATUS_TOASTS: Record<number, { key: string; variant: 'error' | 'warning' }> = {
  403: { key: 'err403', variant: 'error' },
  404: { key: 'err404', variant: 'warning' },
  500: { key: 'err500', variant: 'error' },
};

function initApi() {
  const store = getStore();

  bindAuth({
    getAccessToken: () => store.getState().auth.accessToken,
    tokenRefresher: async () => {
      const refreshToken = store.getState().auth.refreshToken;
      if (!refreshToken) throw new Error('No refresh token');
      const res = await fetch('/api/auth/refresh', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refreshToken }),
      });
      if (!res.ok) throw new Error('Refresh failed');
      const data = (await res.json()) as { accessToken: string; expiresIn: number };
      store.dispatch(
        tokenRefreshed({
          accessToken: data.accessToken,
          expiresAt: Date.now() + data.expiresIn * 1000,
        }),
      );
      store.dispatch(
        logEntry({
          text: 'auth/tokenRefreshed — session refreshed',
          kind: 'auth',
        }),
      );
      return data.accessToken;
    },
    onAuthFailure: () => {
      store.dispatch(loggedOut());
      store.dispatch(
        pushToast({
          title: i18n.t('sectionF.refreshFailed'),
          variant: 'warning',
        }),
      );
      store.dispatch(logEntry({ text: 'auth/refreshFailed → loggedOut', kind: 'auth' }));
      window.dispatchEvent(new CustomEvent('app:force-logout'));
    },
  });

  setupInterceptors((status, message) => {
    const toast = STATUS_TOASTS[status];
    if (toast) {
      store.dispatch(
        pushToast({
          title: i18n.t(`sectionF.${toast.key}`),
          description: message,
          variant: toast.variant,
        }),
      );
    }
  });
}

let initialized = false;

export function ensureApiInitialized(): void {
  if (!initialized) {
    initApi();
    initialized = true;
  }
}
