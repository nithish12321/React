import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { FilterValue, TableSort } from '@/components/data-table/types';

export interface PersistedTableView {
  page: number;
  pageSize: number;
  sorting: TableSort[];
  filters: Record<string, FilterValue>;
  search: string;
  hiddenColumns: string[];
}

export type TableViewState = Record<string, PersistedTableView>;

const emptyView = (pageSize = 10): PersistedTableView => ({
  page: 1,
  pageSize,
  sorting: [],
  filters: {},
  search: '',
  hiddenColumns: [],
});

const initialState: TableViewState = {};

const tableStateSlice = createSlice({
  name: 'tableState',
  initialState,
  reducers: {
    upsertTableState(state, action: PayloadAction<{ id: string; value: PersistedTableView }>) {
      state[action.payload.id] = action.payload.value;
    },
    setPage(state, action: PayloadAction<{ id: string; page: number }>) {
      state[action.payload.id] ??= emptyView();
      state[action.payload.id].page = action.payload.page;
    },
    setPageSize(state, action: PayloadAction<{ id: string; pageSize: number }>) {
      state[action.payload.id] ??= emptyView(action.payload.pageSize);
      state[action.payload.id].pageSize = action.payload.pageSize;
      state[action.payload.id].page = 1;
    },
    reset: () => initialState,
  },
});

export const { upsertTableState, setPage, setPageSize, reset } = tableStateSlice.actions;
export default tableStateSlice.reducer;
