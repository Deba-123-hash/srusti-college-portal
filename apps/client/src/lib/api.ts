// =============================================================================
// Srusti Academy of Management and Technology — College Portal
// Centralized Axios HTTP Client with RS256 Bearer & Silent Refresh Queue
// =============================================================================

import axios, { AxiosError, InternalAxiosRequestConfig } from "axios";
import { useAuthStore } from "../store/authStore";

const API_BASE_URL = import.meta.env.VITE_API_URL || "/api/v1";

export const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

let isRefreshing = false;
let failedQueue: Array<{
  resolve: (value?: unknown) => void;
  reject: (reason?: unknown) => void;
}> = [];

const processQueue = (error: AxiosError | null, token: string | null = null) => {
  failedQueue.forEach((promise) => {
    if (error) {
      promise.reject(error);
    } else {
      promise.resolve(token);
    }
  });
  failedQueue = [];
};

// ---------------------------------------------------------------------------
// Request Interceptor: Attach in-memory RS256 Access Token
// ---------------------------------------------------------------------------
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const accessToken = useAuthStore.getState().accessToken;
    if (accessToken && config.headers) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ---------------------------------------------------------------------------
// Response Interceptor: Silent Token Refresh on 401
// ---------------------------------------------------------------------------
api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & {
      _retry?: boolean;
    };

    if (!originalRequest) {
      return Promise.reject(error);
    }

    const requestUrl = originalRequest.url || "";
    const isAuthRoute =
      requestUrl.includes("/auth/login") ||
      requestUrl.includes("/auth/refresh");

    // Only intercept 401 errors on non-auth endpoints that haven't been retried yet
    if (error.response?.status === 401 && !originalRequest._retry && !isAuthRoute) {
      if (isRefreshing) {
        // Queue concurrent requests until refresh completes
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            if (originalRequest.headers) {
              originalRequest.headers.Authorization = `Bearer ${token}`;
            }
            return api(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        // Silent token refresh via httpOnly cookie
        const refreshResponse = await axios.post(
          `${API_BASE_URL}/auth/refresh`,
          {},
          { withCredentials: true }
        );

        const newAccessToken = refreshResponse.data?.data?.accessToken;

        if (!newAccessToken) {
          throw new Error("No access token returned from refresh endpoint");
        }

        // Store new access token in memory only
        useAuthStore.getState().setAccessToken(newAccessToken);

        // Resume queued requests
        processQueue(null, newAccessToken);

        // Retry the original request
        if (originalRequest.headers) {
          originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        }
        return api(originalRequest);
      } catch (refreshError: any) {
        processQueue(refreshError, null);
        useAuthStore.getState().clearAuth();

        // Redirect to login if on protected route (student/admin)
        const path = window.location.pathname;
        if (path.startsWith("/student") || path.startsWith("/admin") || path.startsWith("/faculty")) {
          window.location.href = `/login?from=${encodeURIComponent(path)}`;
        }

        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

export default api;
