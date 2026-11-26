import axios, { AxiosError, type AxiosRequestConfig } from 'axios';

export const axiosInstance = axios.create({
  baseURL: '/api',
});

// ---- loading bar coordination (kept as tiny counters, not redux state) ----
let loadingCount = 0;
const listeners = new Set<(active: boolean) => void>();

export function onLoadingChange(fn: (active: boolean) => void): () => void {
  listeners.add(fn);
  fn(loadingCount > 0);
  return () => listeners.delete(fn);
}

export function notifyLoading(delta: 1 | -1) {
  loadingCount = Math.max(0, loadingCount + delta);
  listeners.forEach((fn) => fn(loadingCount > 0));
}

// ---- auth token plumbing (set by the store, avoids a circular import) ----
let getAccessToken: () => string | null = () => null;
let tokenRefresher: (() => Promise<string>) | null = null;
let onAuthFailure: (() => void) | null = null;

export function bindAuth(deps: {
  getAccessToken: () => string | null;
  tokenRefresher: () => Promise<string>;
  onAuthFailure: () => void;
}) {
  getAccessToken = deps.getAccessToken;
  tokenRefresher = deps.tokenRefresher;
  onAuthFailure = deps.onAuthFailure;
}

// ---- 401 refresh queue (single-flight) ----
let isRefreshing = false;
const failedQueue: Array<{
  resolve: (token: string) => void;
  reject: (err: unknown) => void;
}> = [];

function flushQueue(token: string | null, error: unknown) {
  while (failedQueue.length) {
    const entry = failedQueue.shift();
    if (!entry) break;
    if (token) entry.resolve(token);
    else entry.reject(error);
  }
}

async function refreshAndRetry(original: AxiosRequestConfig): Promise<unknown> {
  if (!tokenRefresher) throw new Error('Auth not initialised');
  try {
    const token = await tokenRefresher();
    flushQueue(token, null);
    original.headers = { ...original.headers, Authorization: `Bearer ${token}` };
    return await axiosInstance.request(original);
  } catch (err) {
    flushQueue(null, err);
    onAuthFailure?.();
    throw err;
  } finally {
    isRefreshing = false;
  }
}

// ---- network retry with exponential backoff ----
const RETRYABLE = new Set(['ECONNABORTED', 'ERR_NETWORK']);
const NETWORK_RETRIES = 3;

function retryDelay(attempt: number) {
  return new Promise((r) => setTimeout(r, 2 ** attempt * 250));
}

export function setupInterceptors(onStatusError: (status: number, message: string) => void) {
  axiosInstance.interceptors.request.use(async (config) => {
    notifyLoading(1);
    const token = getAccessToken();
    if (token) config.headers.Authorization = `Bearer ${token}`;
    config.headers['X-Request-Id'] = crypto.randomUUID();
    return config;
  });

  axiosInstance.interceptors.response.use(
    (res) => {
      notifyLoading(-1);
      return res;
    },
    async (error: AxiosError) => {
      notifyLoading(-1);
      const config = error.config as
        (AxiosRequestConfig & { _retry?: boolean; _networkAttempt?: number }) | undefined;
      const status = error.response?.status;

      if (status === 401 && config && !config._retry) {
        config._retry = true;
        if (isRefreshing) {
          return new Promise<string>((resolve, reject) => {
            failedQueue.push({ resolve, reject });
          }).then((token) => {
            config.headers = { ...config.headers, Authorization: `Bearer ${token}` };
            return axiosInstance.request(config);
          });
        }
        isRefreshing = true;
        return refreshAndRetry(config);
      }

      const code = (error as { code?: string }).code ?? '';
      if (RETRYABLE.has(code) && config) {
        const attempt = (config._networkAttempt ?? 0) + 1;
        if (attempt <= NETWORK_RETRIES) {
          config._networkAttempt = attempt;
          await retryDelay(attempt);
          return axiosInstance.request(config);
        }
      }

      if (status) {
        onStatusError(
          status,
          (error.response?.data as { message?: string })?.message ?? error.message,
        );
      }
      return Promise.reject({ ...error, handled: Boolean(status) });
    },
  );
}
