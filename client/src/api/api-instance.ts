import axios from "axios";
import { AuthResponse } from "../types/auth";

const SERVER_URL = import.meta.env.VITE_SERVER_URL;

/**
 * Configured Axios instance for API requests.
 * This instance includes interceptors for automatic token handling and refresh on 401 errors.
 * It sets the base URL from environment variables, enables credentials for cross-origin requests,
 * and includes JSON content-type headers.
 */
export const api = axios.create({
  baseURL: SERVER_URL,
  withCredentials: true,
  headers: {
    "Content-type": "application/json",
  },
});

/**
 * Request interceptor to add Authorization header with Bearer token from localStorage.
 * Automatically attaches the access token to every outgoing request.
 */
api.interceptors.request.use((config) => {
  config.headers.Authorization = `Bearer ${localStorage.getItem("token")}`;
  return config;
});

/**
 * Response interceptor to handle authentication errors and token refresh.
 * If a 401 error occurs and it's not a retry, attempts to refresh the token using the refresh endpoint.
 * Updates localStorage with the new access token and retries the original request.
 * Rejects the promise if refresh fails or for other errors.
 */
api.interceptors.response.use(
  (config) => {
    return config;
  },
  async (error) => {
    const originalRequest = error.config;
    if (error.response?.status === 401 && !originalRequest._isRetry) {
      originalRequest._isRetry = true;

      const { data } = await axios.post<AuthResponse>(
        `${SERVER_URL}/auth/refresh`,
        {},
        { withCredentials: true },
      );
      localStorage.setItem("token", data.accessToken);
      return api.request(originalRequest);
    }

    return Promise.reject(error);
  },
);
