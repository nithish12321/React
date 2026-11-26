import { createApi } from '@reduxjs/toolkit/query';
import { axiosBaseQuery } from './baseQuery';
import { axiosInstance } from '@/lib/axios';
import type { RootState } from '@/app/store';

export interface ScenarioResponse {
  ok: boolean;
  scenario: string;
  latencyMs: number;
  message?: string;
  retried?: boolean;
  refreshed?: boolean;
}

export const showcaseApi = createApi({
  reducerPath: 'showcaseApi',
  baseQuery: axiosBaseQuery({ baseUrl: '/api' }),
  tagTypes: [],
  endpoints: () => ({}),
});

export function runScenario(scenario: string): Promise<ScenarioResponse> {
  return axiosInstance.post<ScenarioResponse>('/scenario', { scenario }).then((r) => r.data);
}

export function selectEmail(state: RootState): string | null {
  return state.auth.email;
}

export const axiosBase = axiosBaseQuery;
