import { axiosInstance } from '@/lib/axios';

export interface ScenarioResponse {
  ok: boolean;
  scenario: string;
  latencyMs: number;
  message?: string;
  retried?: boolean;
  refreshed?: boolean;
}

/** Runs one of the four demo scenarios against the mocked API. */
export function runScenario(scenario: string): Promise<ScenarioResponse> {
  return axiosInstance.post<ScenarioResponse>('/scenario', { scenario }).then((r) => r.data);
}
