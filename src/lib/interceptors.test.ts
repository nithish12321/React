import { describe, it, expect, vi, beforeEach } from 'vitest';
import {
  axiosInstance,
  bindAuth,
  setupInterceptors,
  onLoadingChange,
  notifyLoading,
} from './interceptors';

describe('Axios interceptors & loading notification', () => {
  beforeEach(() => {
    bindAuth({
      getAccessToken: () => 'fake-token-123',
      tokenRefresher: async () => 'refreshed-token-456',
      onAuthFailure: vi.fn(),
    });
  });

  it('notifies loading listeners on loading count changes', () => {
    const listener = vi.fn();
    const unsubscribe = onLoadingChange(listener);

    expect(listener).toHaveBeenCalledWith(false);

    notifyLoading(1);
    expect(listener).toHaveBeenCalledWith(true);

    notifyLoading(-1);
    expect(listener).toHaveBeenCalledWith(false);

    unsubscribe();
  });

  it('sets up request and response interceptors without crashing', () => {
    const onStatusError = vi.fn();
    expect(() => setupInterceptors(onStatusError)).not.toThrow();
  });

  it('has base URL configured', () => {
    expect(axiosInstance.defaults.baseURL).toBe('/api');
  });
});
