/**
 * Axios wrapper for the Tibeb backend API.
 *
 * - Sends credentials (httpOnly JWT cookie) with every request.
 * - On 401, redirects to /login (client-side only).
 * - Throws ApiRequestError on non-2xx responses.
 */

import axios, { AxiosError } from 'axios';
import type { ApiError } from '@/src/types';

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:9000';

export class ApiRequestError extends Error {
  constructor(
    public readonly status: number,
    public readonly code: string,
    message: string,
  ) {
    super(message);
    this.name = 'ApiRequestError';
  }
}

const apiClient = axios.create({
  baseURL: API_BASE,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError<ApiError>) => {
    if (error.response?.status === 401) {
      // Redirect to login on the client side, but avoid infinite loops
      if (typeof window !== 'undefined' && window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
      return Promise.reject(new ApiRequestError(401, 'unauthorized', 'Session expired'));
    }

    if (error.response) {
      const { status, data } = error.response;
      return Promise.reject(
        new ApiRequestError(
          status,
          data?.error || 'unknown',
          data?.message || (data as unknown as string) || error.message,
        ),
      );
    }

    return Promise.reject(error);
  },
);

// Convenience methods
export const api = {
  get: <T>(path: string) => apiClient.get<T>(path).then((res) => res.data),
  post: <T>(path: string, body: unknown) =>
    apiClient.post<T>(path, body).then((res) => res.data),
  put: <T>(path: string, body: unknown) =>
    apiClient.put<T>(path, body).then((res) => res.data),
  delete: <T>(path: string) => apiClient.delete<T>(path).then((res) => res.data),
};
