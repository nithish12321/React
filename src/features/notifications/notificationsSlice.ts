import { createSlice, nanoid, type PayloadAction } from '@reduxjs/toolkit';

export interface AppNotification {
  id: string;
  title: string;
  body: string;
  time: string;
  read: boolean;
}

interface NotificationsState {
  items: AppNotification[];
}

const seed = (): AppNotification[] => [
  {
    id: nanoid(),
    title: 'Welcome',
    body: 'The showcase is ready to explore.',
    time: new Date().toISOString(),
    read: false,
  },
  {
    id: nanoid(),
    title: 'Phase 2 shipped',
    body: 'Interceptors, i18n and the AppShell are live.',
    time: new Date().toISOString(),
    read: false,
  },
  {
    id: nanoid(),
    title: 'Try the settings',
    body: 'Every visual option applies instantly.',
    time: new Date().toISOString(),
    read: true,
  },
];

const notificationsSlice = createSlice({
  name: 'notifications',
  initialState: { items: seed() } as NotificationsState,
  reducers: {
    addNotification(state, action: PayloadAction<{ title: string; body: string }>) {
      state.items.unshift({
        id: nanoid(),
        read: false,
        time: new Date().toISOString(),
        ...action.payload,
      });
    },
    markAllRead(state) {
      state.items.forEach((n) => (n.read = true));
    },
    clearNotifications(state) {
      state.items = [];
    },
  },
});

export const { addNotification, markAllRead, clearNotifications } = notificationsSlice.actions;
export default notificationsSlice.reducer;
