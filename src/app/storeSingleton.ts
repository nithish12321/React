import { useRef } from 'react';
import { makeStore, type AppStore } from './store';

export type { AppStore };

export function useAppStoreRef(): React.MutableRefObject<AppStore | null> {
  const ref = useRef<AppStore | null>(null);
  return ref;
}

export const storeHolder: { current: AppStore | null } = { current: null };

export function getStore(): AppStore {
  if (!storeHolder.current) {
    storeHolder.current = makeStore();
  }
  return storeHolder.current;
}
