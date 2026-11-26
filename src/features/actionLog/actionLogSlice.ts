import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

export interface ActionLogEntry {
  id: number;
  time: string;
  text: string;
  kind: 'action' | 'http' | 'auth';
}

interface ActionLogState {
  entries: ActionLogEntry[];
  nextId: number;
}

const initialState: ActionLogState = { entries: [], nextId: 1 };

const actionLogSlice = createSlice({
  name: 'actionLog',
  initialState,
  reducers: {
    logEntry(state, action: PayloadAction<{ text: string; kind: ActionLogEntry['kind'] }>) {
      state.entries.unshift({
        id: state.nextId,
        time: new Date().toISOString(),
        ...action.payload,
      });
      if (state.entries.length > 100) state.entries.length = 100;
      state.nextId += 1;
    },
    clearLog(state) {
      state.entries = [];
    },
  },
});

export const { logEntry, clearLog } = actionLogSlice.actions;
export default actionLogSlice.reducer;
