import { useRef } from 'react';
import { PersistGate } from 'redux-persist/integration/react';
import { Provider } from 'react-redux';
import { persistStore } from 'redux-persist';
import { getStore } from './storeSingleton';
import { ensureApiInitialized } from './apiBootstrap';
import { useThemeEngine } from '@/features/settings/useThemeEngine';
import { useAppLanguage } from '@/features/settings/useAppLanguage';
import { SettingsDrawer } from '@/features/settings/SettingsDrawer';
import { Toaster } from '@/components/feedback/Toast';

function GlobalEffects() {
  useThemeEngine();
  useAppLanguage();
  return null;
}

export function Providers({ children }: { children: React.ReactNode }) {
  const storeRef = useRef(getStore());
  ensureApiInitialized();
  const persistorRef = useRef(persistStore(storeRef.current));

  return (
    <Provider store={storeRef.current}>
      <PersistGate loading={null} persistor={persistorRef.current}>
        <GlobalEffects />
        {children}
        <SettingsDrawer />
        <Toaster />
      </PersistGate>
    </Provider>
  );
}
