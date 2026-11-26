import { combineReducers } from '@reduxjs/toolkit';
import settingsReducer from '@/features/settings/settingsSlice';
import uiReducer from '@/features/ui/uiSlice';
import authReducer from '@/features/auth/authSlice';
import notificationsReducer from '@/features/notifications/notificationsSlice';
import tableStateReducer from '@/features/tableState/tableStateSlice';
import actionLogReducer from '@/features/actionLog/actionLogSlice';

export const rootReducer = combineReducers({
  settings: settingsReducer,
  ui: uiReducer,
  auth: authReducer,
  notifications: notificationsReducer,
  tableState: tableStateReducer,
  actionLog: actionLogReducer,
});

export type RootState = ReturnType<typeof rootReducer>;
