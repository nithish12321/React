import type { BaseQueryFn } from '@reduxjs/toolkit/query';
import type { AxiosRequestConfig, AxiosError } from 'axios';
import { axiosInstance } from '@/lib/axios';

export interface AxiosBaseQueryError {
  status: number | 'NETWORK_ERROR';
  message: string;
}

export interface AxiosBaseQueryParams {
  url: string;
  method?: AxiosRequestConfig['method'];
  data?: AxiosRequestConfig['data'];
  params?: AxiosRequestConfig['params'];
  headers?: AxiosRequestConfig['headers'];
}

export function axiosBaseQuery({
  baseUrl = '',
}: {
  baseUrl?: string;
} = {}): BaseQueryFn<
  AxiosBaseQueryParams | string,
  unknown,
  AxiosBaseQueryError,
  Record<string, unknown>,
  Record<string, unknown>
> {
  return async (arg) => {
    const config: AxiosRequestConfig =
      typeof arg === 'string'
        ? { url: `${baseUrl}${arg}` }
        : {
            url: `${baseUrl}${arg.url}`,
            method: arg.method,
            data: arg.data,
            params: arg.params,
            headers: arg.headers,
          };
    try {
      const result = await axiosInstance.request(config);
      return { data: result.data };
    } catch (err) {
      const axiosErr = err as AxiosError<{ message?: string }>;
      return {
        error: {
          status: axiosErr.response?.status ?? 'NETWORK_ERROR',
          message: axiosErr.response?.data?.message ?? axiosErr.message,
        },
      };
    }
  };
}
